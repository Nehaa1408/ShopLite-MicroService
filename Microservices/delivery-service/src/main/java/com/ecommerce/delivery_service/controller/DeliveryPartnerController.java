package com.ecommerce.delivery_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.delivery_service.dto.DeliveryVerificationRequest;
import com.ecommerce.delivery_service.entity.DeliveryPartner;
import com.ecommerce.delivery_service.service.DeliveryPartnerService;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(
            DeliveryPartnerService deliveryPartnerService) {

        this.deliveryPartnerService = deliveryPartnerService;
    }

    // ================= APPLY FOR DELIVERY PARTNER =================

    @PostMapping("/apply")
    public ResponseEntity<?> applyForDeliveryPartner(
            @RequestParam Long userId) {

        DeliveryPartner partner = deliveryPartnerService.createDeliveryPartner(userId);

        return ResponseEntity.ok(partner);
    }

    // ================= UPDATE DELIVERY PROFILE =================

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateVerificationProfile(
            @RequestParam Long userId,
            @RequestBody DeliveryVerificationRequest request) {

        DeliveryPartner updatedPartner = deliveryPartnerService.updateVerificationProfile(
                userId,
                request);

        return ResponseEntity.ok(updatedPartner);
    }
    // ================= GET DELIVERY PROFILE =================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestParam Long userId) {

        DeliveryPartner partner = deliveryPartnerService.getByUserId(userId);

        return ResponseEntity.ok(partner);
    }
    // ================= ADMIN - GET PENDING PARTNERS =================

    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPendingPartners() {

        return ResponseEntity.ok(
                deliveryPartnerService.getPendingPartners());
    }
    // ================= ADMIN - APPROVE PARTNER =================

    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approvePartner(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                deliveryPartnerService.approvePartner(id));
    }

    // ================= ADMIN - REJECT PARTNER =================

    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> rejectPartner(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                deliveryPartnerService.rejectPartner(id));
    }
}
