package com.ecommerce.shoplite.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.CreateReturnRequestDTO;
import com.ecommerce.shoplite.dto.ReturnRequestResponse;
import com.ecommerce.shoplite.entity.*;
import com.ecommerce.shoplite.repository.OrderRepository;
import com.ecommerce.shoplite.repository.ReturnRequestRepository;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.dto.OrderItemResponse;

@Service
public class ReturnServiceImpl implements ReturnService {

        @Autowired
        private ReturnRequestRepository returnRequestRepository;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private EmailService emailService;

        // ================= CREATE RETURN REQUEST =================
        @Override
        public ReturnRequestResponse createReturnRequest(
                        CreateReturnRequestDTO request,
                        User user) {

                Order order = orderRepository.findById(
                                request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (!order.getUser().getId().equals(user.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized return request");
                }

                // ONLY DELIVERED ORDERS
                if (order.getStatus() != OrderStatus.DELIVERED) {

                        throw new RuntimeException(
                                        "Only delivered orders can be returned");
                }

                // RETURN WINDOW CHECK
                if (order.getDeliveredAt() == null) {

                        throw new RuntimeException(
                                        "Delivery date not found");
                }

                LocalDateTime expiryDate = order.getDeliveredAt().plusDays(7);

                if (LocalDateTime.now().isAfter(expiryDate)) {

                        throw new RuntimeException(
                                        "Return window expired");
                }

                // PREVENT DUPLICATE RETURNS
                List<ReturnRequest> existingReturns = returnRequestRepository
                                .findByUserOrderByRequestedDateDesc(user);

                for (ReturnRequest existing : existingReturns) {

                        if (!existing.getOrder().getId()
                                        .equals(order.getId())) {
                                continue;
                        }

                        String existingItems = existing.getSelectedItems();

                        for (String newItem : request.getSelectedItems().split(",")) {

                                for (String oldItem : existingItems.split(",")) {

                                        if (newItem.trim()
                                                        .equalsIgnoreCase(oldItem.trim())) {

                                                throw new RuntimeException(
                                                                newItem + " already has a return request");
                                        }
                                }
                        }
                }

                // CREATE RETURN REQUEST
                ReturnRequest returnRequest = new ReturnRequest();

                returnRequest.setOrder(order);

                returnRequest.setUser(user);

                returnRequest.setReturnReason(
                                request.getReturnReason());

                returnRequest.setSelectedItems(
                                request.getSelectedItems());

                returnRequest.setStatus(
                                ReturnStatus.RETURN_REQUESTED);

                // PARTIAL REFUND CALCULATION
                double refundAmount = 0;

                String[] selectedProducts = request.getSelectedItems().split(",");

                for (String productName : selectedProducts) {

                        OrderItem matchedItem = order.getItems()
                                        .stream()
                                        .filter(item -> item.getProduct()
                                                        .getName()
                                                        .trim()
                                                        .equalsIgnoreCase(productName.trim()))
                                        .findFirst()
                                        .orElse(null);

                        if (matchedItem != null) {

                                refundAmount += matchedItem.getPrice()
                                                * matchedItem.getQuantity();
                        }
                }

                returnRequest.setRefundAmount(refundAmount);

                ReturnRequest savedReturn = returnRequestRepository.save(returnRequest);

                emailService.sendReturnRequestEmail(
                                user.getEmail(),
                                user.getName(),
                                savedReturn);

                return mapToResponse(savedReturn);
        }

        // ================= USER RETURNS =================
        @Override
        public List<ReturnRequestResponse> getUserReturns(
                        User user) {

                return returnRequestRepository
                                .findByUserOrderByRequestedDateDesc(user)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= ADMIN RETURNS =================
        @Override
        public List<ReturnRequestResponse> getAllReturns() {

                return returnRequestRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= ASSIGN PICKUP PARTNER =================
        @Override
        public ReturnRequestResponse assignPickupPartner(
                        Long returnId,
                        Long deliveryUserId) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                User deliveryUser = userRepository.findById(deliveryUserId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery user not found"));

                // VALIDATION
                if (deliveryUser.getRole() != Role.DELIVERY) {

                        throw new RuntimeException(
                                        "User is not a delivery partner");
                }

                returnRequest.setPickupPartner(deliveryUser);

                returnRequest.setStatus(
                                ReturnStatus.PICKUP_PARTNER_ASSIGNED);

                ReturnRequest updatedReturn = returnRequestRepository.save(returnRequest);

                return mapToResponse(updatedReturn);
        }

        // ================= UPDATE RETURN STATUS =================
        @Override
        public ReturnRequestResponse updateReturnStatus(
                        Long returnId,
                        String status) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                ReturnStatus returnStatus;

                try {

                        returnStatus = ReturnStatus.valueOf(
                                        status.toUpperCase());

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Invalid return status");
                }

                ReturnStatus currentStatus = returnRequest.getStatus();

                // VALID FLOW CHECK
                if (currentStatus == ReturnStatus.RETURN_REQUESTED &&
                                returnStatus != ReturnStatus.PICKUP_PARTNER_ASSIGNED &&
                                returnStatus != ReturnStatus.RETURN_REJECTED) {

                        throw new RuntimeException(
                                        "Invalid status transition");
                }

                if (currentStatus == ReturnStatus.PICKUP_PARTNER_ASSIGNED &&
                                returnStatus != ReturnStatus.PICKUP_COMPLETED) {

                        throw new RuntimeException(
                                        "Pickup must be completed first");
                }

                if (currentStatus == ReturnStatus.PICKUP_COMPLETED &&
                                returnStatus != ReturnStatus.REFUND_PROCESSED &&
                                returnStatus != ReturnStatus.RETURN_REJECTED) {

                        throw new RuntimeException(
                                        "Return must be inspected first");
                }

                returnRequest.setStatus(returnStatus);

                ReturnRequest updatedReturn = returnRequestRepository.save(returnRequest);

                // REFUND APPROVED EMAIL
                if (returnStatus == ReturnStatus.REFUND_PROCESSED) {

                        emailService.sendRefundApprovedEmail(
                                        updatedReturn.getUser().getEmail(),
                                        updatedReturn.getUser().getName(),
                                        updatedReturn);
                }

                // RETURN REJECTED EMAIL
                if (returnStatus == ReturnStatus.RETURN_REJECTED) {

                        emailService.sendReturnRejectedEmail(
                                        updatedReturn.getUser().getEmail(),
                                        updatedReturn.getUser().getName(),
                                        updatedReturn);
                }

                return mapToResponse(updatedReturn);
        }

        // ================= DELIVERY → ASSIGNED RETURNS =================
        @Override
        public List<ReturnRequestResponse> getAssignedReturns(User user) {

                List<ReturnRequest> returns = returnRequestRepository
                                .findByPickupPartnerOrderByRequestedDateDesc(
                                                user);

                return returns.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= SEND PICKUP OTP =================
        @Override
        public String sendPickupOtp(
                        Long returnId,
                        User user) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                // SECURITY CHECK
                if (returnRequest.getPickupPartner() == null ||
                                !returnRequest.getPickupPartner()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized pickup access");
                }

                // GENERATE OTP
                String otp = String.valueOf(
                                (int) ((Math.random() * 900000) + 100000));

                returnRequest.setPickupOtp(otp);

                returnRequest.setPickupOtpExpiry(
                                LocalDateTime.now().plusMinutes(10));

                returnRequestRepository.save(returnRequest);

                // SEND EMAIL
                emailService.sendOtpEmail(
                                returnRequest.getUser().getEmail(),
                                returnRequest.getUser().getName(),
                                otp);

                return "Pickup OTP sent successfully";
        }

        // ================= VERIFY PICKUP OTP =================
        @Override
        public String verifyPickupOtp(
                        Long returnId,
                        String otp,
                        User user) {

                ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Return request not found"));

                // SECURITY CHECK
                if (returnRequest.getPickupPartner() == null ||
                                !returnRequest.getPickupPartner()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized pickup verification");
                }

                // OTP CHECK
                if (returnRequest.getPickupOtp() == null ||
                                !returnRequest.getPickupOtp().equals(otp)) {

                        throw new RuntimeException(
                                        "Invalid OTP");
                }

                // EXPIRY CHECK
                if (returnRequest.getPickupOtpExpiry() == null ||
                                LocalDateTime.now().isAfter(
                                                returnRequest.getPickupOtpExpiry())) {

                        throw new RuntimeException(
                                        "OTP expired");
                }

                // SUCCESS
                returnRequest.setStatus(
                                ReturnStatus.PICKUP_COMPLETED);

                returnRequest.setPickupOtp(null);

                returnRequest.setPickupOtpExpiry(null);

                returnRequestRepository.save(returnRequest);

                // SEND SUCCESS EMAIL
                emailService.sendReturnPickupSuccessEmail(
                                returnRequest.getUser().getEmail(),
                                returnRequest.getUser().getName(),
                                returnRequest);

                return "Return pickup completed successfully";
        }

        // ================= DTO MAPPER =================
        private ReturnRequestResponse mapToResponse(
                        ReturnRequest returnRequest) {

                ReturnRequestResponse response = new ReturnRequestResponse();

                response.setReturnId(
                                returnRequest.getId());

                response.setOrderId(
                                returnRequest.getOrder().getId());

                response.setCustomerName(
                                returnRequest.getUser().getName());

                response.setCustomerEmail(
                                returnRequest.getUser().getEmail());

                response.setReturnReason(
                                returnRequest.getReturnReason());

                response.setStatus(
                                returnRequest.getStatus().name());

                response.setReturnRequestedDate(
                                returnRequest.getRequestedDate().toString());

                response.setSelectedItems(
                                returnRequest.getSelectedItems());

                response.setRefundAmount(
                                returnRequest.getRefundAmount());

                if (returnRequest.getPickupPartner() != null) {

                        response.setPickupPartnerName(
                                        returnRequest.getPickupPartner().getName());
                }

                List<String> selectedItems = List.of(
                                returnRequest.getSelectedItems().split(","));

                List<OrderItemResponse> items = returnRequest.getOrder()
                                .getItems()
                                .stream()
                                .filter(item -> selectedItems.contains(
                                                item.getProduct().getName()))
                                .map(item -> new OrderItemResponse(
                                                item.getProduct().getName(),
                                                item.getPrice(),
                                                item.getQuantity(),
                                                item.getProduct().getImageUrl()))
                                .toList();

                response.setItems(items);

                return response;
        }

}