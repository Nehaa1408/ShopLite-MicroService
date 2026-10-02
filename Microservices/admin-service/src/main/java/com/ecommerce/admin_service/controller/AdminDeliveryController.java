package com.ecommerce.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.admin_service.dto.DeliveryPartnerResponse;
import com.ecommerce.admin_service.service.AdminDeliveryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/delivery")
@RequiredArgsConstructor
public class AdminDeliveryController {

    private final AdminDeliveryService adminDeliveryService;

    // =========================
    // GET PENDING DELIVERY PARTNERS
    // =========================

    @GetMapping("/pending")
    public ResponseEntity<List<DeliveryPartnerResponse>> getPendingPartners() {

        return ResponseEntity.ok(
                adminDeliveryService.getPendingPartners()
        );
    }

    // =========================
    // APPROVE DELIVERY PARTNER
    // =========================

    @PutMapping("/approve/{id}")
    public ResponseEntity<DeliveryPartnerResponse> approvePartner(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminDeliveryService.approvePartner(id)
        );
    }

    // =========================
    // REJECT DELIVERY PARTNER
    // =========================

    @PutMapping("/reject/{id}")
    public ResponseEntity<DeliveryPartnerResponse> rejectPartner(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminDeliveryService.rejectPartner(id)
        );
    }
}