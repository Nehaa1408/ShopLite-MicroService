package com.ecommerce.order_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order_service.client.CartClient;
import com.ecommerce.order_service.client.NotificationClient;
import com.ecommerce.order_service.client.ProductClient;
import com.ecommerce.order_service.client.UserClient;
import com.ecommerce.order_service.dto.CartItemResponse;
import com.ecommerce.order_service.dto.DeliveryFeedbackRequest;
import com.ecommerce.order_service.dto.DeliveryOtpNotificationRequest;
import com.ecommerce.order_service.dto.OrderItemNotification;
import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderPlacedNotificationRequest;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.dto.OrderStatusNotificationRequest;
import com.ecommerce.order_service.dto.PaymentNotificationRequest;
import com.ecommerce.order_service.dto.PlaceOrderRequest;
import com.ecommerce.order_service.dto.ProductResponse;
import com.ecommerce.order_service.dto.UserResponse;
import com.ecommerce.order_service.entity.DeliveryFeedback;
import com.ecommerce.order_service.entity.DeliveryOtp;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderItem;
import com.ecommerce.order_service.entity.OrderStatus;
import com.ecommerce.order_service.entity.PaymentMethod;
import com.ecommerce.order_service.entity.PaymentStatus;
import com.ecommerce.order_service.repository.DeliveryFeedbackRepository;
import com.ecommerce.order_service.repository.DeliveryOtpRepository;
import com.ecommerce.order_service.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;

        private final CartClient cartClient;

        private final ProductClient productClient;

        private final UserClient userClient;

        private final NotificationClient notificationClient;

        private final DeliveryOtpRepository deliveryOtpRepository;

        private final DeliveryFeedbackRepository deliveryFeedbackRepository;

        // PLACE ORDER

        @Transactional
        public OrderResponse placeOrder(
                        Long userId,
                        PlaceOrderRequest request) {

                UserResponse user = userClient.getUserById(userId);

                // 1. GET CART

                List<CartItemResponse> cartItems = cartClient.getCart(userId);

                if (cartItems == null || cartItems.isEmpty()) {
                        throw new RuntimeException("Cart is empty");
                }

                // 2. CREATE ORDER

                Order order = new Order();

                order.setUserId(userId);

                order.setStatus(OrderStatus.PENDING);

                // 3. PAYMENT METHOD

                PaymentMethod paymentMethod;

                try {

                        paymentMethod = PaymentMethod.valueOf(
                                        request.getPaymentMethod().toUpperCase());

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Invalid payment method");
                }

                order.setPaymentMethod(paymentMethod);

                // 4. PAYMENT STATUS

                if (paymentMethod == PaymentMethod.COD) {

                        order.setPaymentStatus(
                                        PaymentStatus.COD_PENDING);

                } else {

                        order.setPaymentStatus(
                                        PaymentStatus.PENDING_VERIFICATION);
                }

                // 5. CREATE ORDER ITEMS

                List<OrderItem> orderItems = new ArrayList<>();

                double subtotal = 0.0;

                for (CartItemResponse cartItem : cartItems) {

                        // Get latest product information
                        ProductResponse product = productClient.getProductById(
                                        cartItem.getProductId());

                        // PRODUCT VALIDATION

                        if (product == null) {

                                throw new RuntimeException(
                                                "Product not found: "
                                                                + cartItem.getProductId());
                        }

                        if (!product.isActive()) {

                                throw new RuntimeException(
                                                "Product is inactive: "
                                                                + product.getName());
                        }

                        // STOCK VALIDATION

                        if (product.getQuantity() < cartItem.getQuantity()) {

                                throw new RuntimeException(
                                                "Insufficient stock for product: "
                                                                + product.getName());
                        }

                        // CREATE ORDER ITEM

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);

                        orderItem.setProductId(product.getId());

                        orderItem.setProductName(product.getName());

                        orderItem.setProductImage(product.getImageUrl());

                        orderItem.setPrice(product.getPrice());

                        orderItem.setQuantity(cartItem.getQuantity());

                        double itemSubtotal = product.getPrice()
                                        * cartItem.getQuantity();

                        orderItem.setSubtotal(itemSubtotal);

                        subtotal += itemSubtotal;

                        orderItems.add(orderItem);
                }

                // 6. CALCULATE TAX

                double tax = subtotal * 0.04;

                double finalTotal = subtotal + tax;

                // 7. SET ORDER DETAILS

                order.setItems(orderItems);

                order.setTotalAmount(finalTotal);

                // 8. SAVE ORDER

                Order savedOrder = orderRepository.save(order);

                OrderPlacedNotificationRequest notificationRequest = new OrderPlacedNotificationRequest();

                notificationRequest.setEmail(user.getEmail());
                notificationRequest.setName(user.getName());
                notificationRequest.setOrderId(savedOrder.getId());
                notificationRequest.setTotalAmount(savedOrder.getTotalAmount());
                notificationRequest.setPaymentMethod(
                                savedOrder.getPaymentMethod().name());
                notificationRequest.setPaymentStatus(
                                savedOrder.getPaymentStatus().name());

                List<OrderItemNotification> notificationItems = new ArrayList<>();

                for (OrderItem item : savedOrder.getItems()) {

                        OrderItemNotification notificationItem = new OrderItemNotification();

                        notificationItem.setProductName(item.getProductName());
                        notificationItem.setQuantity(item.getQuantity());
                        notificationItem.setPrice(item.getPrice());
                        notificationItem.setSubtotal(item.getSubtotal());

                        notificationItems.add(notificationItem);
                }

                notificationRequest.setItems(notificationItems);
                notificationClient.sendOrderPlacedEmail(notificationRequest);

                // 9. CLEAR CART

                cartClient.clearCart(userId);

                // 10. RETURN RESPONSE

                return mapToResponse(savedOrder);
        }

        // GET USER ORDERS

        @Transactional(readOnly = true)
        public List<OrderResponse> getUserOrders(Long userId) {

                List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);

                return orders.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // GET ORDER BY ID

        @Transactional(readOnly = true)
        public OrderResponse getOrderById(Long orderId, Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(orderId, userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return mapToResponse(order);
        }

        // CANCEL ORDER

        @Transactional
        public OrderResponse cancelOrder(
                        Long orderId,
                        String reason,
                        Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(orderId, userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // Cannot cancel after delivery has started
                if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                                order.getStatus() == OrderStatus.DELIVERED) {

                        throw new RuntimeException(
                                        "Order can no longer be cancelled");
                }

                order.setStatus(OrderStatus.CANCELLED);

                order.setCancellationReason(reason);

                order.setDeliveryPartnerId(null);

                Order savedOrder = orderRepository.save(order);

                // SEND CANCELLATION NOTIFICATION
                UserResponse deliveredUser = userClient.getUserById(savedOrder.getUserId());

                OrderStatusNotificationRequest notificationRequest = new OrderStatusNotificationRequest();

                notificationRequest.setEmail(deliveredUser.getEmail());
                notificationRequest.setName(deliveredUser.getName());
                notificationRequest.setOrderId(savedOrder.getId());
                notificationRequest.setOrderStatus(
                                savedOrder.getStatus().name());

                notificationClient.sendOrderStatusNotification(
                                notificationRequest);

                return mapToResponse(savedOrder);
        }

        // UPDATE ORDER STATUS

        @Transactional
        public OrderResponse updateOrderStatus(
                        @NonNull Long orderId,
                        String status) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                OrderStatus orderStatus;

                try {
                        orderStatus = OrderStatus.valueOf(
                                        status.toUpperCase());
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException(
                                        "Invalid order status: " + status);
                }

                order.setStatus(orderStatus);

                Order savedOrder = orderRepository.save(order);

                // SEND ORDER STATUS NOTIFICATION
                UserResponse user = userClient.getUserById(savedOrder.getUserId());

                OrderStatusNotificationRequest notificationRequest = new OrderStatusNotificationRequest();

                notificationRequest.setEmail(user.getEmail());
                notificationRequest.setName(user.getName());
                notificationRequest.setOrderId(savedOrder.getId());
                notificationRequest.setOrderStatus(
                                savedOrder.getStatus().name());

                notificationClient.sendOrderStatusNotification(
                                notificationRequest);

                return mapToResponse(savedOrder);
        }
        // ================= DELIVERY → SEND OTP =================

        @Transactional
        public String sendDeliveryOtp(Long orderId, Long deliveryPartnerId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryPartnerId() == null
                                || !order.getDeliveryPartnerId().equals(deliveryPartnerId)) {

                        throw new RuntimeException("Unauthorized delivery action");
                }

                // GENERATE 6 DIGIT OTP
                String otp = String.format(
                                "%06d",
                                new Random().nextInt(1_000_000));

                // CREATE OTP
                DeliveryOtp deliveryOtp = new DeliveryOtp();

                deliveryOtp.setOrderId(orderId);
                deliveryOtp.setOtp(otp);

                // OTP VALID FOR 5 MINUTES
                deliveryOtp.setExpiresAt(
                                LocalDateTime.now().plusMinutes(5));

                deliveryOtp.setVerified(false);

                deliveryOtpRepository.save(deliveryOtp);
                UserResponse user = userClient.getUserById(order.getUserId());

                DeliveryOtpNotificationRequest notificationRequest = new DeliveryOtpNotificationRequest();

                notificationRequest.setEmail(user.getEmail());
                notificationRequest.setName(user.getName());
                notificationRequest.setOrderId(order.getId());
                notificationRequest.setOtp(otp);

                notificationClient.sendDeliveryOtpNotification(
                                notificationRequest);

                // ORDER IS OUT FOR DELIVERY
                order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
                orderRepository.save(order);

                return "OTP generated successfully";
        }
        // UPDATE PAYMENT STATUS

        @Transactional
        public OrderResponse updatePaymentStatus(
                        @NonNull Long orderId,
                        String paymentStatus) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                PaymentStatus status;

                try {
                        status = PaymentStatus.valueOf(
                                        paymentStatus.toUpperCase());
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException(
                                        "Invalid payment status: " + paymentStatus);
                }

                order.setPaymentStatus(status);

                Order savedOrder = orderRepository.save(order);

                // SEND PAYMENT NOTIFICATION
                if (status == PaymentStatus.SUCCESS ||
                                status == PaymentStatus.FAILED) {

                        UserResponse user = userClient.getUserById(savedOrder.getUserId());

                        PaymentNotificationRequest notificationRequest = new PaymentNotificationRequest();

                        notificationRequest.setEmail(user.getEmail());
                        notificationRequest.setName(user.getName());
                        notificationRequest.setOrderId(savedOrder.getId());
                        notificationRequest.setAmount(savedOrder.getTotalAmount());
                        notificationRequest.setPaymentMethod(
                                        savedOrder.getPaymentMethod().name());
                        notificationRequest.setPaymentStatus(
                                        savedOrder.getPaymentStatus().name());

                        notificationClient.sendPaymentNotification(
                                        notificationRequest);
                }

                return mapToResponse(savedOrder);
        }

        // GET ALL ORDERS - ADMIN

        @Transactional(readOnly = true)
        public List<OrderResponse> getAllOrders() {

                return orderRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // MAP ORDER → RESPONSE

        private OrderResponse mapToResponse(Order order) {

                List<OrderItemResponse> itemResponses = order.getItems()
                                .stream()
                                .map(item -> {

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
                                })
                                .toList();

                OrderResponse response = new OrderResponse();

                response.setOrderId(order.getId());

                response.setUserId(order.getUserId());

                response.setDeliveryPartnerId(
                                order.getDeliveryPartnerId());

                response.setTotalAmount(
                                order.getTotalAmount());

                response.setStatus(
                                order.getStatus().name());

                response.setOrderDate(
                                order.getOrderDate().toString());

                response.setItems(itemResponses);

                response.setCancelReason(
                                order.getCancellationReason());

                if (order.getDeliveredAt() != null) {

                        response.setDeliveredAt(
                                        order.getDeliveredAt().toString());
                }

                if (order.getPaymentMethod() != null) {
                        response.setPaymentMethod(
                                        order.getPaymentMethod().name());
                }

                if (order.getPaymentStatus() != null) {
                        response.setPaymentStatus(
                                        order.getPaymentStatus().name());
                }

                return response;
        }
        // ================= DELIVERY → VERIFY OTP =================

        @Transactional
        public OrderResponse verifyDeliveryOtp(
                        Long orderId,
                        String enteredOtp,
                        Long deliveryPartnerId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryPartnerId() == null
                                || !order.getDeliveryPartnerId().equals(deliveryPartnerId)) {

                        throw new RuntimeException("Unauthorized delivery action");
                }

                // GET LATEST OTP
                DeliveryOtp deliveryOtp = deliveryOtpRepository
                                .findTopByOrderIdOrderByCreatedAtDesc(orderId)
                                .orElseThrow(() -> new RuntimeException("OTP not found"));

                // ALREADY USED
                if (deliveryOtp.isVerified()) {
                        throw new RuntimeException("OTP already used");
                }

                // EXPIRED
                if (deliveryOtp.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        throw new RuntimeException("OTP expired");
                }

                // WRONG OTP
                if (!deliveryOtp.getOtp().equals(enteredOtp)) {

                        deliveryOtp.setAttempts(
                                        deliveryOtp.getAttempts() + 1);

                        deliveryOtpRepository.save(deliveryOtp);

                        throw new RuntimeException("Invalid OTP");
                }

                // MARK OTP VERIFIED
                deliveryOtp.setVerified(true);
                deliveryOtpRepository.save(deliveryOtp);

                // MARK ORDER DELIVERED
                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(LocalDateTime.now());

                Order savedOrder = orderRepository.save(order);

                // SEND DELIVERED NOTIFICATION
                UserResponse user = userClient.getUserById(savedOrder.getUserId());

                OrderStatusNotificationRequest notificationRequest = new OrderStatusNotificationRequest();

                notificationRequest.setEmail(user.getEmail());
                notificationRequest.setName(user.getName());
                notificationRequest.setOrderId(savedOrder.getId());
                notificationRequest.setOrderStatus(
                                savedOrder.getStatus().name());

                notificationClient.sendOrderStatusNotification(
                                notificationRequest);

                return mapToResponse(savedOrder);
        }
        // ================= DELIVERY FEEDBACK =================

        @Transactional
        public String addDeliveryFeedback(
                        DeliveryFeedbackRequest request,
                        Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(request.getOrderId(), userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // FEEDBACK ONLY AFTER DELIVERY
                if (order.getStatus() != OrderStatus.DELIVERED) {
                        throw new RuntimeException(
                                        "Feedback can only be submitted for delivered orders");
                }

                // ONE FEEDBACK PER ORDER
                if (deliveryFeedbackRepository
                                .findByOrderId(order.getId())
                                .isPresent()) {

                        throw new RuntimeException(
                                        "Feedback already submitted for this order");
                }

                // RATING VALIDATION
                if (request.getRating() < 1 || request.getRating() > 5) {
                        throw new RuntimeException(
                                        "Rating must be between 1 and 5");
                }

                DeliveryFeedback feedback = new DeliveryFeedback();

                feedback.setOrderId(order.getId());
                feedback.setCustomerId(userId);
                feedback.setDeliveryPartnerId(
                                order.getDeliveryPartnerId());
                feedback.setRating(request.getRating());
                feedback.setFeedback(request.getFeedback());

                deliveryFeedbackRepository.save(feedback);

                return "Delivery feedback submitted successfully";
        }
}