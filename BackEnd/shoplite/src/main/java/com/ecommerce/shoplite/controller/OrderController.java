package com.ecommerce.shoplite.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.entity.Product;
import com.ecommerce.shoplite.dto.OrderResponse;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.OrderService;
import com.ecommerce.shoplite.dto.VerifyOtpRequest;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ================= PLACE ORDER =================
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.placeOrder(user));
    }

    // ================= USER ORDERS =================
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    // ================= ORDER DETAILS =================
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getOrderById(user, orderId));
    }

    // ================= CUSTOMER → CANCEL ORDER =================
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam String reason,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.cancelOrder(
                        orderId,
                        reason,
                        user));
    }

    // ================= ADMIN: UPDATE STATUS =================
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // ================= ADMIN: GET ALL =================
    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ================= ADMIN: STATS =================
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        return ResponseEntity.ok(orderService.getAdminStats());
    }

    // ================= ADMIN: TOP PRODUCTS =================
    @GetMapping("/admin/top-products")
    public ResponseEntity<List<Product>> getTopProducts() {

        return ResponseEntity.ok(
                orderService.getTopSellingProducts());
    }

    // ================= DELIVERY: ACTIVE =================
    @GetMapping("/delivery")
    public ResponseEntity<List<OrderResponse>> getDeliveryOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getOrdersForDelivery(user));
    }

    // ================= DELIVERY: COMPLETED =================
    @GetMapping("/delivery/completed")
    public ResponseEntity<List<OrderResponse>> getCompletedOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getCompletedOrdersForDelivery(user));
    }

    // ================= DELIVERY: SEND OTP =================
    @PostMapping("/delivery/{orderId}/send-otp")
    public ResponseEntity<String> sendDeliveryOtp(
            @PathVariable Long orderId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.sendDeliveryOtp(orderId, user));
    }

    // ================= DELIVERY: VERIFY OTP =================
    @PostMapping("/delivery/{orderId}/verify-otp")
    public ResponseEntity<OrderResponse> verifyDeliveryOtp(
            @PathVariable Long orderId,
            @RequestBody VerifyOtpRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.verifyDeliveryOtp(
                        orderId,
                        request.getOtp(),
                        user));
    }

    // ================= DELIVERY: MARK DELIVERED =================
    @PutMapping("/delivery/{orderId}/complete")
    public ResponseEntity<OrderResponse> markDelivered(
            @PathVariable Long orderId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.markAsDelivered(orderId, user));
    }

    // ================= DELIVERY: FAILED DELIVERY =================
    @PutMapping("/delivery/{orderId}/failed")
    public ResponseEntity<OrderResponse> markDeliveryFailed(
            @PathVariable Long orderId,
            @RequestParam String reason,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.markDeliveryFailed(
                        orderId,
                        reason,
                        user));
    }

    // ================= ADMIN: ASSIGN DELIVERY =================
    @PutMapping("/admin/{orderId}/assign/{deliveryUserId}")
    public ResponseEntity<OrderResponse> assignDeliveryAgent(
            @PathVariable Long orderId,
            @PathVariable Long deliveryUserId) {

        return ResponseEntity.ok(
                orderService.assignDeliveryAgent(orderId, deliveryUserId));
    }
}