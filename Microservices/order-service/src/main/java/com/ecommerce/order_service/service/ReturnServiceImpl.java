package com.ecommerce.order_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order_service.client.NotificationClient;
import com.ecommerce.order_service.client.UserClient;
import com.ecommerce.order_service.dto.CreateReturnRequestDTO;
import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.ReturnNotificationRequest;
import com.ecommerce.order_service.dto.ReturnRequestResponse;
import com.ecommerce.order_service.dto.UserResponse;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderItem;
import com.ecommerce.order_service.entity.OrderStatus;
import com.ecommerce.order_service.entity.ReturnRequest;
import com.ecommerce.order_service.entity.ReturnStatus;
import com.ecommerce.order_service.repository.OrderRepository;
import com.ecommerce.order_service.repository.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnServiceImpl implements ReturnService {

        private final ReturnRequestRepository returnRequestRepository;
        private final OrderRepository orderRepository;
        private final UserClient userClient;
        private final NotificationClient notificationClient;
        // ================= CREATE RETURN REQUEST =================

        @Override
        @Transactional
        public ReturnRequestResponse createReturnRequest(
                        CreateReturnRequestDTO request,
                        Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(request.getOrderId(), userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // RETURN ONLY AFTER DELIVERY
                if (order.getStatus() != OrderStatus.DELIVERED) {
                        throw new RuntimeException(
                                        "Return can only be requested for delivered orders");
                }

                // DELIVERY DATE REQUIRED
                if (order.getDeliveredAt() == null) {
                        throw new RuntimeException(
                                        "Delivery date not available");
                }

                // 7-DAY RETURN WINDOW
                LocalDateTime returnDeadline = order.getDeliveredAt().plusDays(7);

                if (LocalDateTime.now().isAfter(returnDeadline)) {
                        throw new RuntimeException(
                                        "Return window has expired");
                }

                // SELECTED ITEMS REQUIRED
                if (request.getSelectedItems() == null
                                || request.getSelectedItems().trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Please select at least one item");
                }

                // PREVENT DUPLICATE RETURN FOR SAME ITEM
                List<ReturnRequest> existingReturns = returnRequestRepository
                                .findByUserIdOrderByRequestedDateDesc(userId);

                for (ReturnRequest existingReturn : existingReturns) {

                        if (!existingReturn.getOrderId().equals(order.getId())) {
                                continue;
                        }

                        if (existingReturn.getSelectedItems() == null) {
                                continue;
                        }

                        String[] existingItems = existingReturn.getSelectedItems().split(",");

                        String[] requestedItems = request.getSelectedItems().split(",");

                        for (String requestedItem : requestedItems) {

                                String requested = requestedItem.trim();

                                for (String existingItem : existingItems) {

                                        if (requested.equalsIgnoreCase(
                                                        existingItem.trim())) {

                                                throw new RuntimeException(
                                                                "Return already requested for item: "
                                                                                + requested);
                                        }
                                }
                        }
                }

                // CREATE RETURN REQUEST
                ReturnRequest returnRequest = new ReturnRequest();

                returnRequest.setOrderId(order.getId());
                returnRequest.setUserId(userId);
                returnRequest.setReturnReason(
                                request.getReturnReason());
                returnRequest.setSelectedItems(
                                request.getSelectedItems());
                returnRequest.setStatus(
                                ReturnStatus.RETURN_REQUESTED);

                // CALCULATE PARTIAL REFUND
                double refundAmount = 0.0;

                String[] selectedItems = request.getSelectedItems().split(",");

                for (String selectedItem : selectedItems) {

                        String selected = selectedItem.trim();

                        for (OrderItem orderItem : order.getItems()) {

                                if (orderItem.getProductName()
                                                .equalsIgnoreCase(selected)) {

                                        refundAmount += orderItem.getPrice()
                                                        * orderItem.getQuantity();

                                        break;
                                }
                        }
                }

                returnRequest.setRefundAmount(refundAmount);

                ReturnRequest savedReturn = returnRequestRepository.save(returnRequest);

                UserResponse customer = userClient.getUserById(userId);

                ReturnNotificationRequest notification = new ReturnNotificationRequest();

                notification.setEmail(customer.getEmail());
                notification.setName(customer.getName());
                notification.setReturnId(savedReturn.getId());
                notification.setOrderId(savedReturn.getOrderId());
                notification.setStatus(savedReturn.getStatus().name());
                notification.setRefundAmount(savedReturn.getRefundAmount());

                notificationClient.sendReturnNotification(notification);

                return mapToResponse(savedReturn);
        }

        // ================= GET USER RETURNS =================

        @Override
        @Transactional(readOnly = true)
        public List<ReturnRequestResponse> getUserReturns(
                        Long userId) {

                return returnRequestRepository
                                .findByUserIdOrderByRequestedDateDesc(userId)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= GET ALL RETURNS =================

        @Override
        @Transactional(readOnly = true)
        public List<ReturnRequestResponse> getAllReturns() {

                return returnRequestRepository
                                .findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= ASSIGN PICKUP PARTNER =================

        @Override
        @Transactional
        public ReturnRequestResponse assignPickupPartner(
                        Long returnId,
                        Long deliveryUserId) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                UserResponse pickupPartner = userClient.getUserById(deliveryUserId);

                if (pickupPartner == null) {
                        throw new RuntimeException(
                                        "Delivery partner not found");
                }

                returnRequest.setPickupPartnerId(
                                deliveryUserId);

                returnRequest.setStatus(
                                ReturnStatus.PICKUP_PARTNER_ASSIGNED);

                ReturnRequest savedReturn = returnRequestRepository.save(returnRequest);

                return mapToResponse(savedReturn);
        }

        // ================= UPDATE RETURN STATUS =================

        @Override
        @Transactional
        public ReturnRequestResponse updateReturnStatus(
                        Long returnId,
                        String status) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                ReturnStatus newStatus;

                try {

                        newStatus = ReturnStatus.valueOf(
                                        status.toUpperCase());

                } catch (IllegalArgumentException e) {

                        throw new RuntimeException(
                                        "Invalid return status: " + status);
                }

                ReturnStatus currentStatus = returnRequest.getStatus();

                // VALID STATUS TRANSITIONS

                if (currentStatus == ReturnStatus.RETURN_REQUESTED) {

                        if (newStatus != ReturnStatus.PICKUP_PARTNER_ASSIGNED
                                        && newStatus != ReturnStatus.RETURN_REJECTED) {

                                throw new RuntimeException(
                                                "Invalid return status transition");
                        }

                } else if (currentStatus == ReturnStatus.PICKUP_PARTNER_ASSIGNED) {

                        if (newStatus != ReturnStatus.PICKUP_COMPLETED
                                        && newStatus != ReturnStatus.RETURN_REJECTED) {

                                throw new RuntimeException(
                                                "Invalid return status transition");
                        }

                } else if (currentStatus == ReturnStatus.PICKUP_COMPLETED) {

                        if (newStatus != ReturnStatus.REFUND_PROCESSED
                                        && newStatus != ReturnStatus.RETURN_REJECTED) {

                                throw new RuntimeException(
                                                "Invalid return status transition");
                        }

                } else {

                        throw new RuntimeException(
                                        "Return status cannot be changed from "
                                                        + currentStatus);
                }

                returnRequest.setStatus(newStatus);

                ReturnRequest savedReturn = returnRequestRepository.save(returnRequest);

                UserResponse customer = userClient.getUserById(
                                savedReturn.getUserId());

                ReturnNotificationRequest notification = new ReturnNotificationRequest();

                notification.setEmail(customer.getEmail());
                notification.setName(customer.getName());
                notification.setReturnId(savedReturn.getId());
                notification.setOrderId(savedReturn.getOrderId());
                notification.setStatus(savedReturn.getStatus().name());
                notification.setRefundAmount(savedReturn.getRefundAmount());

                notificationClient.sendReturnNotification(notification);

                return mapToResponse(savedReturn);
        }

        // ================= ASSIGNED RETURNS =================

        @Override
        @Transactional(readOnly = true)
        public List<ReturnRequestResponse> getAssignedReturns(
                        Long userId) {

                return returnRequestRepository
                                .findByPickupPartnerIdOrderByRequestedDateDesc(userId)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= COMPLETED PICKUPS =================

        @Override
        @Transactional(readOnly = true)
        public List<ReturnRequestResponse> getCompletedPickups(
                        Long userId) {

                return returnRequestRepository
                                .findByPickupPartnerIdOrderByRequestedDateDesc(userId)
                                .stream()
                                .filter(returnRequest -> returnRequest.getStatus() == ReturnStatus.PICKUP_COMPLETED
                                                ||
                                                returnRequest.getStatus() == ReturnStatus.REFUND_PROCESSED
                                                ||
                                                returnRequest.getStatus() == ReturnStatus.RETURN_REJECTED)
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= SEND PICKUP OTP =================

        @Override
        @Transactional
        public String sendPickupOtp(
                        Long returnId,
                        Long userId) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                // SECURITY CHECK
                if (returnRequest.getPickupPartnerId() == null
                                || !returnRequest.getPickupPartnerId()
                                                .equals(userId)) {

                        throw new RuntimeException(
                                        "Unauthorized pickup action");
                }

                // OTP ONLY AFTER PARTNER ASSIGNMENT
                if (returnRequest.getStatus() != ReturnStatus.PICKUP_PARTNER_ASSIGNED) {

                        throw new RuntimeException(
                                        "Pickup OTP cannot be generated for current status");
                }

                // GENERATE 6 DIGIT OTP
                String otp = String.format(
                                "%06d",
                                new Random().nextInt(1_000_000));

                returnRequest.setPickupOtp(otp);

                // OTP VALID FOR 10 MINUTES
                returnRequest.setPickupOtpExpiry(
                                LocalDateTime.now().plusMinutes(10));

                returnRequestRepository.save(returnRequest);

                return "Pickup OTP generated successfully";
        }

        // ================= VERIFY PICKUP OTP =================

        @Override
        @Transactional
        public String verifyPickupOtp(
                        Long returnId,
                        String otp,
                        Long userId) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                // SECURITY CHECK
                if (returnRequest.getPickupPartnerId() == null
                                || !returnRequest.getPickupPartnerId()
                                                .equals(userId)) {

                        throw new RuntimeException(
                                        "Unauthorized pickup action");
                }

                // STATUS CHECK
                if (returnRequest.getStatus() != ReturnStatus.PICKUP_PARTNER_ASSIGNED) {

                        throw new RuntimeException(
                                        "Pickup cannot be completed for current status");
                }

                // OTP CHECK
                if (returnRequest.getPickupOtp() == null) {

                        throw new RuntimeException(
                                        "Pickup OTP not generated");
                }

                if (returnRequest.getPickupOtpExpiry() == null
                                || returnRequest.getPickupOtpExpiry()
                                                .isBefore(LocalDateTime.now())) {

                        throw new RuntimeException(
                                        "Pickup OTP expired");
                }

                if (!returnRequest.getPickupOtp()
                                .equals(otp)) {

                        throw new RuntimeException(
                                        "Invalid pickup OTP");
                }

                // MARK PICKUP COMPLETED
                returnRequest.setStatus(
                                ReturnStatus.PICKUP_COMPLETED);

                returnRequest.setPickupOtp(null);
                returnRequest.setPickupOtpExpiry(null);

                returnRequestRepository.save(returnRequest);

                return "Pickup completed successfully";
        }

        // ================= MAP RESPONSE =================

        private ReturnRequestResponse mapToResponse(
                        ReturnRequest returnRequest) {

                ReturnRequestResponse response = new ReturnRequestResponse();

                response.setReturnId(
                                returnRequest.getId());

                response.setOrderId(
                                returnRequest.getOrderId());

                response.setReturnReason(
                                returnRequest.getReturnReason());

                response.setStatus(
                                returnRequest.getStatus() != null
                                                ? returnRequest.getStatus().name()
                                                : null);

                if (returnRequest.getRequestedDate() != null) {

                        response.setReturnRequestedDate(
                                        returnRequest.getRequestedDate()
                                                        .toString());
                }

                response.setSelectedItems(
                                returnRequest.getSelectedItems());

                response.setRefundAmount(
                                returnRequest.getRefundAmount());

                // CUSTOMER DETAILS
                try {

                        UserResponse customer = userClient.getUserById(
                                        returnRequest.getUserId());

                        if (customer != null) {

                                response.setCustomerName(
                                                customer.getName());

                                response.setCustomerEmail(
                                                customer.getEmail());
                        }

                } catch (Exception ignored) {
                        // Keep return response available even if
                        // User Service is temporarily unavailable.
                }

                // PICKUP PARTNER DETAILS
                if (returnRequest.getPickupPartnerId() != null) {

                        try {

                                UserResponse pickupPartner = userClient.getUserById(
                                                returnRequest
                                                                .getPickupPartnerId());

                                if (pickupPartner != null) {

                                        response.setPickupPartnerName(
                                                        pickupPartner.getName());
                                }

                        } catch (Exception ignored) {
                                // Keep response available if User Service
                                // is temporarily unavailable.
                        }
                }

                // ORDER ITEMS
                Order order = orderRepository
                                .findById(returnRequest.getOrderId())
                                .orElse(null);

                if (order != null) {

                        List<OrderItemResponse> items = order.getItems()
                                        .stream()
                                        .map(this::mapOrderItem)
                                        .toList();

                        response.setItems(items);
                }

                return response;
        }

        private OrderItemResponse mapOrderItem(
                        OrderItem item) {

                OrderItemResponse response = new OrderItemResponse();

                response.setProductId(
                                item.getProductId());

                response.setProductName(
                                item.getProductName());

                response.setPrice(
                                item.getPrice());

                response.setQuantity(
                                item.getQuantity());

                response.setSubtotal(
                                item.getSubtotal());

                response.setImage(
                                item.getProductImage());

                return response;
        }
}