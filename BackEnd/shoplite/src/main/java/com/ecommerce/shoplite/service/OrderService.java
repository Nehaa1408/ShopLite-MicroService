package com.ecommerce.shoplite.service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.OrderItemResponse;
import com.ecommerce.shoplite.dto.OrderResponse;
import com.ecommerce.shoplite.entity.*;
import com.ecommerce.shoplite.repository.CartRepository;
import com.ecommerce.shoplite.repository.OrderRepository;
import com.ecommerce.shoplite.repository.ProductRepository;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.repository.DeliveryOtpRepository;
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
        private ProductRepository productRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private DeliveryOtpRepository deliveryOtpRepository;

        @Autowired
        private EmailService emailService;
        @Autowired
        private DeliveryFeedbackRepository deliveryFeedbackRepository;

        // ================= PLACE ORDER =================
        @Transactional
        public OrderResponse placeOrder(User user) {

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

                        total += cart.getQuantity() * cart.getProduct().getPrice();

                        orderItems.add(item);
                }

                order.setItems(orderItems);
                order.setTotalAmount(total);

                Order savedOrder = orderRepository.save(order);

                cartRepository.deleteByUser(user);

                return mapToResponse(savedOrder);
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

                response.setCancelReason(
                                order.getCancellationReason());

                response.setOrderDate(order.getOrderDate().toString());
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