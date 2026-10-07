package com.ecommerce.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.admin_service.dto.ReturnRequestResponse;
import com.ecommerce.admin_service.service.AdminReturnService;

@RestController
@RequestMapping("/api/admin/returns")
public class AdminReturnController {

    private final AdminReturnService adminReturnService;

    public AdminReturnController(AdminReturnService adminReturnService) {
        this.adminReturnService = adminReturnService;
    }

    @GetMapping
    public ResponseEntity<List<ReturnRequestResponse>> getAllReturns() {

        return ResponseEntity.ok(
                adminReturnService.getAllReturns());
    }

    @PutMapping("/{returnId}/assign/{deliveryUserId}")
    public ResponseEntity<ReturnRequestResponse> assignPickupPartner(
            @PathVariable Long returnId,
            @PathVariable Long deliveryUserId) {

        return ResponseEntity.ok(
                adminReturnService.assignPickupPartner(
                        returnId,
                        deliveryUserId));
    }

    @PutMapping("/{returnId}/status")
    public ResponseEntity<ReturnRequestResponse> updateReturnStatus(
            @PathVariable Long returnId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                adminReturnService.updateReturnStatus(
                        returnId,
                        status));
    }
}