package com.ecommerce.shoplite.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.OrderResponse;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;
import com.ecommerce.shoplite.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // 🔐 Extract userId from JWT
    private Long getUserIdFromToken(String token) {
        token = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // 🛒 PLACE ORDER (USER)
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader("Authorization") String token) {

        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.placeOrder(userId));
    }

    // 👤 USER ORDERS
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @RequestHeader("Authorization") String token) {

        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    // 🔍 ORDER DETAILS
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String token) {

        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.getOrderById(userId, orderId));
    }

    // 🔄 UPDATE STATUS (ADMIN)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    
    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 📊 ADMIN → DASHBOARD STATS
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        return ResponseEntity.ok(orderService.getAdminStats());
    }
}