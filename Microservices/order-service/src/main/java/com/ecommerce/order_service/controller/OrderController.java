package com.ecommerce.order_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.dto.PlaceOrderRequest;
import com.ecommerce.order_service.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // =====================================================
    // PLACE ORDER
    // =====================================================

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody PlaceOrderRequest request) {

        return ResponseEntity.ok(
                orderService.placeOrder(userId, request)
        );
    }


    // =====================================================
    // GET USER ORDERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                orderService.getUserOrders(userId)
        );
    }


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderService.getOrderById(orderId, userId)
        );
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId,
            @RequestParam String reason) {

        return ResponseEntity.ok(
                orderService.cancelOrder(
                        orderId,
                        reason,
                        userId
                )
        );
    }


    // =====================================================
    // ADMIN - UPDATE ORDER STATUS
    // =====================================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        status
                )
        );
    }


    // =====================================================
    // ADMIN - GET ALL ORDERS
    // =====================================================

    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }
}