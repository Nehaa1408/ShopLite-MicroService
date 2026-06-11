package com.ecommerce.shoplite.service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.OrderItemResponse;
import com.ecommerce.shoplite.dto.OrderResponse;
import com.ecommerce.shoplite.dto.TransactionResponse;
import com.ecommerce.shoplite.entity.*;
import com.ecommerce.shoplite.repository.TransactionRepository;
import com.ecommerce.shoplite.repository.CartRepository;
import com.ecommerce.shoplite.repository.OrderRepository;
import com.ecommerce.shoplite.repository.ProductRepository;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.repository.DeliveryOtpRepository;
import com.ecommerce.shoplite.repository.DeliveryPartnerRepository;
import com.ecommerce.shoplite.dto.DeliveryFeedbackRequest;
import com.ecommerce.shoplite.repository.DeliveryFeedbackRepository;
import org.springframework.data.domain.PageRequest;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

        @Autowired
        private CartRepository cartRepository;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private TransactionRepository transactionRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private DeliveryOtpRepository deliveryOtpRepository;

        @Autowired
        private EmailService emailService;

        @Autowired
        private DeliveryFeedbackRepository deliveryFeedbackRepository;

        @Autowired
        private DeliveryPartnerRepository deliveryPartnerRepository;

        // ================= PLACE ORDER =================
        @Transactional
        public OrderResponse placeOrder(
                        User user,
                        String paymentMethod,
                        String paymentScreenshot) {

                List<Cart> cartItems = cartRepository.findByUser(user);

                if (cartItems.isEmpty()) {
                        throw new RuntimeException("Cart is empty");
                }

                Order order = new Order();

                order.setUser(user);

                order.setOrderDate(LocalDateTime.now());

                order.setStatus(OrderStatus.PLACED);

                List<OrderItem> orderItems = new ArrayList<>();

                double total = 0;

                for (Cart cart : cartItems) {

                        OrderItem item = new OrderItem();

                        item.setOrder(order);

                        item.setProduct(cart.getProduct());

                        item.setQuantity(cart.getQuantity());

                        item.setPrice(cart.getProduct().getPrice());

                        total += cart.getQuantity()
                                        * cart.getProduct().getPrice();

                        orderItems.add(item);
                }

                order.setItems(orderItems);
                double subtotal = cartItems.stream()
                                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                                .sum();

                double tax = subtotal * 0.04;

                double finalTotal = subtotal + tax;

                order.setTotalAmount(finalTotal);

                // ================= SAVE ORDER =================

                Order savedOrder = orderRepository.save(order);

                // ================= CREATE TRANSACTION =================

                Transaction transaction = new Transaction();

                transaction.setTransactionId(
                                "TXN-" +
                                                UUID.randomUUID()
                                                                .toString()
                                                                .substring(0, 8)
                                                                .toUpperCase());

                transaction.setOrder(savedOrder);

                transaction.setUser(user);

                transaction.setAmount(savedOrder.getTotalAmount());

                // ================= PAYMENT METHOD =================

                PaymentMethod method;

                try {

                        method = PaymentMethod.valueOf(
                                        paymentMethod.toUpperCase());

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Invalid payment method");
                }

                transaction.setPaymentMethod(method);

                // SAVE PAYMENT SCREENSHOT
                transaction.setPaymentScreenshot(
                                paymentScreenshot);

                // ================= PAYMENT STATUS =================
                if (method == PaymentMethod.COD) {

                        transaction.setPaymentStatus(
                                        PaymentStatus.COD_PENDING);

                } else {

                        // UPI / CARD
                        transaction.setPaymentStatus(
                                        PaymentStatus.PENDING_VERIFICATION);
                }

                transactionRepository.save(transaction);

                // LINK TRANSACTION TO ORDER
                savedOrder.setTransaction(transaction);

                orderRepository.save(savedOrder);

                // AUTO ASSIGN DELIVERY FOR COD
                if (method == PaymentMethod.COD) {
                        autoAssignDeliveryPartner(savedOrder);
                }

                // ================= CLEAR CART =================

                cartRepository.deleteByUser(user);

                return mapToResponse(savedOrder);
        }

        @Transactional
        public OrderResponse verifyPayment(
                        Long orderId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                Transaction transaction = transactionRepository
                                .findByOrder(order)
                                .orElseThrow(() -> new RuntimeException("Transaction not found"));

                // ONLY VERIFY PENDING PAYMENTS
                if (transaction.getPaymentStatus() != PaymentStatus.PENDING_VERIFICATION) {

                        throw new RuntimeException(
                                        "Payment is not pending verification");
                }

                // MARK SUCCESS
                transaction.setPaymentStatus(
                                PaymentStatus.SUCCESS);
                transactionRepository.save(transaction);

                // AUTO ASSIGN DELIVERY PARTNER
                autoAssignDeliveryPartner(order);

                // SEND PAYMENT SUCCESS EMAIL
                emailService.sendPaymentSuccessEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                order,
                                transaction);

                return mapToResponse(order);
        }

        public List<TransactionResponse> getAllTransactions() {

                return transactionRepository
                                .findAllByOrderByPaidAtDesc()
                                .stream()
                                .map(transaction -> {

                                        TransactionResponse response = new TransactionResponse();

                                        response.setTransactionId(
                                                        transaction.getTransactionId());

                                        response.setOrderId(
                                                        transaction.getOrder().getId());

                                        response.setCustomerName(
                                                        transaction.getUser().getName());

                                        response.setCustomerEmail(
                                                        transaction.getUser().getEmail());

                                        response.setAmount(
                                                        transaction.getAmount());

                                        response.setPaymentMethod(
                                                        transaction.getPaymentMethod().name());

                                        response.setPaymentStatus(
                                                        transaction.getPaymentStatus().name());

                                        response.setPaymentScreenshot(
                                                        transaction.getPaymentScreenshot());

                                        response.setPaidAt(
                                                        transaction.getPaidAt().toString());

                                        return response;
                                })
                                .toList();
        }

        // ================= USER ORDERS =================
        public List<OrderResponse> getUserOrders(User user) {

                List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);

                return orders.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= GET ORDER BY ID =================
        public OrderResponse getOrderById(User user, Long orderId) {

                Order order = orderRepository.findByIdAndUser(orderId, user)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return mapToResponse(order);
        }

        // ================= UPDATE STATUS (ADMIN) =================
        @Transactional
        public OrderResponse updateOrderStatus(Long orderId, String status) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                OrderStatus enumStatus;
                try {
                        enumStatus = OrderStatus.valueOf(status.toUpperCase());
                } catch (Exception e) {
                        throw new RuntimeException("Invalid status value");
                }

                order.setStatus(enumStatus);

                return mapToResponse(orderRepository.save(order));
        }

        // ================= ADMIN → GET ALL =================
        public List<OrderResponse> getAllOrders() {

                return orderRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= ADMIN STATS =================
        public Map<String, Long> getAdminStats() {

                Map<String, Long> stats = new HashMap<>();

                stats.put("users", userRepository.count());
                stats.put("orders", orderRepository.count());
                stats.put("products", productRepository.count());

                return stats;
        }

        // ================= TOP SELLING PRODUCTS =================
        public List<Product> getTopSellingProducts() {

                return orderRepository.findTopSellingProducts(
                                PageRequest.of(0, 3));
        }

        // ================= DELIVERY → ACTIVE =================
        public List<OrderResponse> getOrdersForDelivery(User deliveryUser) {

                List<Order> orders = orderRepository.findAll()
                                .stream()
                                .filter(order ->

                                order.getDeliveryAgent() != null &&

                                                order.getDeliveryAgent()
                                                                .getId()
                                                                .equals(deliveryUser.getId())
                                                &&

                                                (order.getStatus() == OrderStatus.PACKED ||

                                                                order.getStatus() == OrderStatus.OUT_FOR_DELIVERY))
                                .toList();

                return orders.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= DELIVERY → COMPLETED =================
        public List<OrderResponse> getCompletedOrdersForDelivery(User deliveryUser) {

                List<Order> orders = orderRepository
                                .findByDeliveryAgentAndStatus(deliveryUser, OrderStatus.DELIVERED);

                return orders.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // ================= DELIVERY → SEND OTP =================
        @Transactional
        public String sendDeliveryOtp(
                        Long orderId,
                        User deliveryUser) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryAgent() == null ||
                                !order.getDeliveryAgent()
                                                .getId()
                                                .equals(deliveryUser.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized delivery action");
                }

                // GENERATE 6 DIGIT OTP
                String otp = String.format(
                                "%06d",
                                new Random().nextInt(999999));

                // CREATE OTP ENTITY
                DeliveryOtp deliveryOtp = new DeliveryOtp();

                deliveryOtp.setOrder(order);

                deliveryOtp.setOtp(otp);

                // OTP VALID FOR 5 MINUTES
                deliveryOtp.setExpiresAt(
                                LocalDateTime.now().plusMinutes(5));

                deliveryOtp.setVerified(false);

                deliveryOtpRepository.save(deliveryOtp);

                order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
                orderRepository.save(order);

                // SEND EMAIL TO CUSTOMER
                emailService.sendDeliveryOtp(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                otp);

                return "OTP sent successfully";
        }

        // ================= DELIVERY → VERIFY OTP =================
        @Transactional
        public OrderResponse verifyDeliveryOtp(
                        Long orderId,
                        String enteredOtp,
                        User deliveryUser) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryAgent() == null ||
                                !order.getDeliveryAgent()
                                                .getId()
                                                .equals(deliveryUser.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized delivery action");
                }

                // GET LATEST OTP
                DeliveryOtp deliveryOtp = deliveryOtpRepository
                                .findTopByOrderOrderByCreatedAtDesc(order)
                                .orElseThrow(() -> new RuntimeException("OTP not found"));

                // ALREADY USED
                if (deliveryOtp.isVerified()) {

                        throw new RuntimeException(
                                        "OTP already used");
                }

                // EXPIRED
                if (deliveryOtp.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        throw new RuntimeException(
                                        "OTP expired");
                }

                // WRONG OTP
                if (!deliveryOtp.getOtp()
                                .equals(enteredOtp)) {

                        deliveryOtp.setAttempts(
                                        deliveryOtp.getAttempts() + 1);

                        deliveryOtpRepository.save(deliveryOtp);

                        throw new RuntimeException(
                                        "Invalid OTP");
                }

                // MARK VERIFIED
                deliveryOtp.setVerified(true);

                deliveryOtpRepository.save(deliveryOtp);

                // MARK ORDER DELIVERED
                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(LocalDateTime.now());

                // SEND DELIVERY SUCCESS EMAIL
                emailService.sendDeliverySuccessEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                order);

                return mapToResponse(
                                orderRepository.save(order));
        }

        // ================= ADMIN → ASSIGN DELIVERY =================
        @Transactional
        public OrderResponse assignDeliveryAgent(Long orderId, Long deliveryUserId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                User deliveryUser = userRepository.findById(deliveryUserId)
                                .orElseThrow(() -> new RuntimeException("Delivery user not found"));

                // IMPORTANT VALIDATION
                if (deliveryUser.getRole() != Role.DELIVERY) {
                        throw new RuntimeException("User is not a delivery agent");
                }

                order.setDeliveryAgent(deliveryUser);

                order.setStatus(OrderStatus.PACKED);

                emailService.sendOutForDeliveryEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                deliveryUser.getName());

                return mapToResponse(orderRepository.save(order));
        }

        // ================= DELIVERY → MARK DELIVERED =================
        @Transactional
        public OrderResponse markAsDelivered(Long orderId, User deliveryUser) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryAgent() == null ||
                                !order.getDeliveryAgent().getId().equals(deliveryUser.getId())) {
                        throw new RuntimeException("Unauthorized delivery action");
                }

                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(LocalDateTime.now());

                return mapToResponse(orderRepository.save(order));
        }

        // ================= DELIVERY → FAILED DELIVERY =================
        @Transactional
        public OrderResponse markDeliveryFailed(
                        Long orderId,
                        String reason,
                        User deliveryUser) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryAgent() == null ||
                                !order.getDeliveryAgent().getId().equals(deliveryUser.getId())) {

                        throw new RuntimeException("Unauthorized delivery action");
                }

                // UPDATE STATUS
                order.setStatus(OrderStatus.DELIVERY_FAILED);

                // SAVE REASON
                order.setCancellationReason(reason);

                return mapToResponse(orderRepository.save(order));
        }

        // ================= CUSTOMER → CANCEL ORDER =================
        @Transactional
        public OrderResponse cancelOrder(
                        Long orderId,
                        String reason,
                        User customer) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (!order.getUser().getId().equals(customer.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized cancellation action");
                }

                // ALLOW ONLY BEFORE DELIVERY
                if (order.getStatus() == OrderStatus.DELIVERED ||
                                order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {

                        throw new RuntimeException(
                                        "Order can no longer be cancelled");
                }

                // UPDATE STATUS
                order.setStatus(OrderStatus.CANCELLED);

                // SAVE REASON
                order.setCancellationReason(reason);

                // REMOVE DELIVERY AGENT
                order.setDeliveryAgent(null);

                return mapToResponse(orderRepository.save(order));
        }

        // ================= CUSTOMER → ADD DELIVERY FEEDBACK =================
        @Transactional
        public String addDeliveryFeedback(
                        User customer,
                        DeliveryFeedbackRequest request) {

                Order order = orderRepository.findById(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (!order.getUser().getId().equals(customer.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized feedback action");
                }

                // ORDER MUST BE DELIVERED
                if (order.getStatus() != OrderStatus.DELIVERED) {

                        throw new RuntimeException(
                                        "Feedback allowed only after delivery");
                }

                // FEEDBACK ALREADY EXISTS
                if (deliveryFeedbackRepository.findByOrder(order).isPresent()) {

                        throw new RuntimeException(
                                        "Feedback already submitted");
                }

                // VALIDATE RATING
                if (request.getRating() == null ||
                                request.getRating() < 1 ||
                                request.getRating() > 5) {

                        throw new RuntimeException(
                                        "Rating must be between 1 and 5");
                }

                DeliveryFeedback feedback = new DeliveryFeedback();

                feedback.setOrder(order);

                feedback.setCustomer(customer);

                feedback.setDeliveryPartner(order.getDeliveryAgent());

                feedback.setRating(request.getRating());

                feedback.setFeedback(request.getFeedback());

                deliveryFeedbackRepository.save(feedback);

                return "Delivery feedback submitted successfully";
        }

        @Transactional
        public OrderResponse confirmCodPayment(
                        Long orderId,
                        User deliveryUser) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // SECURITY CHECK
                if (order.getDeliveryAgent() == null ||

                                !order.getDeliveryAgent()
                                                .getId()
                                                .equals(deliveryUser.getId())) {

                        throw new RuntimeException(
                                        "Unauthorized delivery action");
                }

                Transaction transaction = transactionRepository
                                .findByOrder(order)
                                .orElseThrow(() -> new RuntimeException("Transaction not found"));

                // ONLY COD ALLOWED
                if (transaction.getPaymentMethod() != PaymentMethod.COD) {

                        throw new RuntimeException(
                                        "This order is not COD");
                }

                // MARK PAYMENT SUCCESS
                transaction.setPaymentStatus(
                                PaymentStatus.SUCCESS);

                transactionRepository.save(transaction);

                // SEND PAYMENT SUCCESS EMAIL
                emailService.sendPaymentSuccessEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                order,
                                transaction);

                return mapToResponse(order);
        }

        @Transactional
        public OrderResponse rejectPayment(
                        Long orderId,
                        String reason) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                Transaction transaction = transactionRepository
                                .findByOrder(order)
                                .orElseThrow(() -> new RuntimeException("Transaction not found"));

                // ONLY PENDING PAYMENTS CAN BE REJECTED
                if (transaction.getPaymentStatus() != PaymentStatus.PENDING_VERIFICATION) {

                        throw new RuntimeException(
                                        "Payment is not pending verification");
                }

                // UPDATE TRANSACTION STATUS
                transaction.setPaymentStatus(
                                PaymentStatus.FAILED);

                transactionRepository.save(transaction);

                // CANCEL ORDER
                order.setStatus(OrderStatus.CANCELLED);

                order.setCancellationReason(
                                reason);

                orderRepository.save(order);

                // SEND REJECTION EMAIL
                emailService.sendPaymentRejectedEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                order,
                                reason);

                return mapToResponse(order);
        }

        // ================= AUTO ASSIGN DELIVERY PARTNER =================
        private void autoAssignDeliveryPartner(Order order) {

                if (order.getDeliveryAgent() != null) {
                        return;
                }
                List<DeliveryPartner> partners = deliveryPartnerRepository.findByApprovedTrueAndActiveTrue();

                if (partners.isEmpty()) {
                        return;
                }

                DeliveryPartner partner = partners.get(0);

                order.setDeliveryAgent(partner.getUser());

                order.setStatus(OrderStatus.PACKED);

                emailService.sendOutForDeliveryEmail(
                                order.getUser().getEmail(),
                                order.getUser().getName(),
                                partner.getUser().getName());

                orderRepository.save(order);
        }

        // ================= DTO MAPPER =================
        private OrderResponse mapToResponse(Order order) {

                List<OrderItemResponse> itemResponses = order.getItems()
                                .stream()
                                .map(item -> {
                                        OrderItemResponse dto = new OrderItemResponse();
                                        dto.setProductName(item.getProduct().getName());
                                        dto.setPrice(item.getPrice());
                                        dto.setQuantity(item.getQuantity());
                                        dto.setImage(item.getProduct().getImageUrl());
                                        return dto;
                                })
                                .toList();

                OrderResponse response = new OrderResponse();
                response.setOrderId(order.getId());
                response.setTotalAmount(order.getTotalAmount());
                response.setStatus(order.getStatus().name());

                if (order.getTransaction() != null) {

                        response.setTransactionId(
                                        order.getTransaction().getTransactionId());

                        response.setPaymentMethod(
                                        order.getTransaction()
                                                        .getPaymentMethod()
                                                        .name());

                        response.setPaymentStatus(
                                        order.getTransaction()
                                                        .getPaymentStatus()
                                                        .name());

                        response.setPaymentScreenshot(
                                        order.getTransaction()
                                                        .getPaymentScreenshot());
                }

                response.setCancelReason(
                                order.getCancellationReason());

                response.setOrderDate(order.getOrderDate().toString());

                if (order.getDeliveredAt() != null) {

                        response.setDeliveredAt(
                                        order.getDeliveredAt().toString());

                        response.setReturnEligibleTill(
                                        order.getDeliveredAt()
                                                        .plusDays(7)
                                                        .toLocalDate()
                                                        .toString());

                        boolean eligible = !LocalDateTime.now().toLocalDate().isAfter(
                                        order.getDeliveredAt()
                                                        .plusDays(7)
                                                        .toLocalDate());

                        response.setReturnEligible(eligible);
                }

                response.setItems(itemResponses);

                if (order.getUser() != null) {

                        response.setCustomerName(
                                        order.getUser().getName());

                        response.setCustomerEmail(
                                        order.getUser().getEmail());
                }

                if (order.getDeliveryAgent() != null) {

                        response.setDeliveryAgentName(
                                        order.getDeliveryAgent().getName());

                        response.setDeliveryAgentEmail(
                                        order.getDeliveryAgent().getEmail());
                }

                // DELIVERY FEEDBACK
                deliveryFeedbackRepository
                                .findByOrder(order)
                                .ifPresent(feedback -> {

                                        response.setDeliveryRating(
                                                        feedback.getRating());

                                        response.setDeliveryFeedback(
                                                        feedback.getFeedback());
                                });

                return response;
        }
}