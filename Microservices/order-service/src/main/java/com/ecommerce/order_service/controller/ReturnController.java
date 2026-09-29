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

import com.ecommerce.order_service.dto.CreateReturnRequestDTO;
import com.ecommerce.order_service.dto.ReturnRequestResponse;
import com.ecommerce.order_service.service.ReturnService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    // ================= CUSTOMER =================

    @PostMapping("/request")
    public ResponseEntity<ReturnRequestResponse> createReturnRequest(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateReturnRequestDTO request) {

        return ResponseEntity.ok(
                returnService.createReturnRequest(
                        request,
                        userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReturnRequestResponse>> getMyReturns(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                returnService.getUserReturns(userId));
    }

    // ================= ADMIN =================

    @GetMapping("/admin")
    public ResponseEntity<List<ReturnRequestResponse>> getAllReturns() {

        return ResponseEntity.ok(
                returnService.getAllReturns());
    }

    @PutMapping("/admin/{returnId}/assign/{deliveryUserId}")
    public ResponseEntity<ReturnRequestResponse> assignPickupPartner(
            @PathVariable Long returnId,
            @PathVariable Long deliveryUserId) {

        return ResponseEntity.ok(
                returnService.assignPickupPartner(
                        returnId,
                        deliveryUserId));
    }

    @PutMapping("/admin/{returnId}/status")
    public ResponseEntity<ReturnRequestResponse> updateReturnStatus(
            @PathVariable Long returnId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                returnService.updateReturnStatus(
                        returnId,
                        status));
    }

    // ================= DELIVERY PARTNER =================

    @GetMapping("/assigned")
    public ResponseEntity<List<ReturnRequestResponse>> getAssignedReturns(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                returnService.getAssignedReturns(userId));
    }

    @PostMapping("/{returnId}/send-pickup-otp")
    public ResponseEntity<String> sendPickupOtp(
            @PathVariable Long returnId,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                returnService.sendPickupOtp(
                        returnId,
                        userId));
    }

    @PostMapping("/{returnId}/verify-pickup-otp")
    public ResponseEntity<String> verifyPickupOtp(
            @PathVariable Long returnId,
            @RequestParam String otp,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                returnService.verifyPickupOtp(
                        returnId,
                        otp,
                        userId));
    }

    @GetMapping("/completed-pickups")
    public ResponseEntity<List<ReturnRequestResponse>> getCompletedPickups(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                returnService.getCompletedPickups(userId));
    }
}