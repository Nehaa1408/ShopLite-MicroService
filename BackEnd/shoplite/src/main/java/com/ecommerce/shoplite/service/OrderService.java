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

    // ================= DELIVERY → ACTIVE =================
    public List<OrderResponse> getOrdersForDelivery(User deliveryUser) {

        List<Order> orders = orderRepository
                .findByDeliveryAgentAndStatus(deliveryUser, OrderStatus.OUT_FOR_DELIVERY);

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

        // CORRECT STATUS
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);

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
        response.setOrderDate(order.getOrderDate().toString());
        response.setItems(itemResponses);

        // Optional (useful for frontend)
        if (order.getDeliveryAgent() != null) {
            response.setDeliveryAgentName(order.getDeliveryAgent().getName());
        }

        return response;
    }
}