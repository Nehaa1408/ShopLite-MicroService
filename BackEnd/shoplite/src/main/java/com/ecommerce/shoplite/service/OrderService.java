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
    private UserRepository userRepository; // only used for admin stats

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

        return response;
    }
}