package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.CreateReturnRequestDTO;
import com.ecommerce.shoplite.dto.OtpVerificationRequest;
import com.ecommerce.shoplite.dto.ReturnRequestResponse;
import com.ecommerce.shoplite.entity.Role;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.ReturnService;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "*")
public class ReturnController {

        @Autowired
        private ReturnService returnService;

        // ================= USER → CREATE RETURN =================
        @PostMapping("/request")
        public ResponseEntity<ReturnRequestResponse> createReturnRequest(
                        @RequestBody CreateReturnRequestDTO request,
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                returnService.createReturnRequest(
                                                request,
                                                user));
        }

        // ================= USER → MY RETURNS =================
        @GetMapping("/my")
        public ResponseEntity<List<ReturnRequestResponse>> getUserReturns(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                returnService.getUserReturns(user));
        }

        // ================= ADMIN → ALL RETURNS =================
        @GetMapping("/admin")
        public ResponseEntity<List<ReturnRequestResponse>> getAllReturns() {

                return ResponseEntity.ok(
                                returnService.getAllReturns());
        }

        // ================= ADMIN → ASSIGN PICKUP =================
        @PutMapping("/admin/{returnId}/assign/{deliveryUserId}")
        public ResponseEntity<ReturnRequestResponse> assignPickupPartner(
                        @PathVariable Long returnId,
                        @PathVariable Long deliveryUserId) {

                return ResponseEntity.ok(
                                returnService.assignPickupPartner(
                                                returnId,
                                                deliveryUserId));
        }

        // ================= ADMIN → UPDATE STATUS =================
        @PutMapping("/admin/{returnId}/status")
        public ResponseEntity<ReturnRequestResponse> updateReturnStatus(
                        @PathVariable Long returnId,
                        @RequestParam String status) {

                return ResponseEntity.ok(
                                returnService.updateReturnStatus(
                                                returnId,
                                                status));
        }

        // ================= DELIVERY → ASSIGNED RETURNS =================
        @GetMapping("/assigned")
        public ResponseEntity<List<ReturnRequestResponse>> getAssignedReturns(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                if (user.getRole() != Role.DELIVERY) {

                        throw new RuntimeException(
                                        "Access denied");
                }

                return ResponseEntity.ok(
                                returnService.getAssignedReturns(user));
        }

        // ================= DELIVERY → SEND PICKUP OTP =================
        @PostMapping("/{returnId}/send-pickup-otp")
        public ResponseEntity<String> sendPickupOtp(
                        @PathVariable Long returnId,
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                returnService.sendPickupOtp(
                                                returnId,
                                                user));
        }

        // ================= DELIVERY → VERIFY PICKUP OTP =================
        @PostMapping("/{returnId}/verify-pickup-otp")
        public ResponseEntity<String> verifyPickupOtp(
                        @PathVariable Long returnId,
                        @RequestBody OtpVerificationRequest request,
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                returnService.verifyPickupOtp(
                                                returnId,
                                                request.getOtp(),
                                                user));
        }

        // ================= DELIVERY → COMPLETED PICKUPS =================
        @GetMapping("/completed-pickups")
        public ResponseEntity<List<ReturnRequestResponse>> getCompletedPickups(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                if (user.getRole() != Role.DELIVERY) {

                        throw new RuntimeException(
                                        "Access denied");
                }

                return ResponseEntity.ok(
                                returnService.getCompletedPickups(user));
        }
}