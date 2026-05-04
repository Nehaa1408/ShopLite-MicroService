package com.ecommerce.shoplite.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.OrderResponse;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // PLACE ORDER
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.placeOrder(user));
    }

    // USER ORDERS
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    // ORDER DETAILS
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getOrderById(user, orderId));
    }

    // ADMIN: UPDATE STATUS
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // ADMIN: GET ALL ORDERS
    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ADMIN: STATS
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        return ResponseEntity.ok(orderService.getAdminStats());
    }
}