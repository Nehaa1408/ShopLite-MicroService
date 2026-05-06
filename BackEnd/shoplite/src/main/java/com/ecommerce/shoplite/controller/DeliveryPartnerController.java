package com.ecommerce.shoplite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.DeliveryRegisterRequest;
import com.ecommerce.shoplite.dto.DeliveryRegisterResponse;
import com.ecommerce.shoplite.dto.DeliveryVerificationRequest;
import com.ecommerce.shoplite.entity.DeliveryPartner;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.DeliveryPartnerService;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryPartnerController {

        @Autowired
        private DeliveryPartnerService deliveryPartnerService;

        // ================= REGISTER =================
        @PostMapping("/register")
        public ResponseEntity<?> registerDeliveryPartner(
                        @RequestBody DeliveryRegisterRequest request) {

                DeliveryRegisterResponse response = deliveryPartnerService.registerDeliveryPartner(request);

                return ResponseEntity.ok(response);
        }

        // ================= GET PROFILE =================
        @GetMapping("/profile")
        public ResponseEntity<?> getProfile(
                        Authentication authentication) {

                System.out.println("========== GET PROFILE ==========");
                System.out.println("AUTHENTICATION : " + authentication);

                if (authentication == null) {

                        return ResponseEntity.badRequest()
                                        .body("Authentication is NULL");
                }

                // GET LOGGED-IN USER DIRECTLY
                User user = (User) authentication.getPrincipal();

                System.out.println("USER EMAIL : " + user.getEmail());

                DeliveryPartner partner = deliveryPartnerService.getByUser(user);

                return ResponseEntity.ok(partner);
        }

        // ================= UPDATE VERIFICATION PROFILE =================
        @PutMapping("/profile/update")
        public ResponseEntity<?> updateVerificationProfile(
                        Authentication authentication,
                        @RequestBody DeliveryVerificationRequest request) {

                System.out.println("========== UPDATE PROFILE ==========");

                // DEBUG AUTH
                System.out.println("AUTHENTICATION : " + authentication);

                if (authentication == null) {

                        return ResponseEntity.badRequest()
                                        .body("Authentication is NULL");
                }

                // GET LOGGED-IN USER DIRECTLY
                User user = (User) authentication.getPrincipal();

                System.out.println("USER EMAIL : " + user.getEmail());

                // DEBUG REQUEST
                System.out.println("PHONE : " + request.getPhone());

                System.out.println("VEHICLE TYPE : "
                                + request.getVehicleType());

                System.out.println("VEHICLE NUMBER : "
                                + request.getVehicleNumber());

                System.out.println("LICENSE NUMBER : "
                                + request.getLicenseNumber());

                System.out.println("AADHAAR NUMBER : "
                                + request.getAadhaarNumber());

                System.out.println("PROFILE IMAGE EXISTS : "
                                + (request.getProfileImage() != null));

                System.out.println("DOCUMENT IMAGE EXISTS : "
                                + (request.getDocumentImage() != null));

                DeliveryPartner updatedPartner = deliveryPartnerService.updateVerificationProfile(
                                user,
                                request);

                System.out.println("PROFILE UPDATED SUCCESSFULLY");

                return ResponseEntity.ok(updatedPartner);
        }

        // ================= ADMIN APPROVE =================
        @PutMapping("/approve/{id}")
        public ResponseEntity<?> approvePartner(
                        @PathVariable Long id) {

                DeliveryPartner partner = deliveryPartnerService.approvePartner(id);

                return ResponseEntity.ok(partner);
        }

        // ================= GET ALL PARTNERS =================
        @GetMapping("/all")
        public ResponseEntity<?> getAllPartners() {

                return ResponseEntity.ok(
                                deliveryPartnerService.getAllPartners());
        }

        // ================= GET PARTNER BY ID =================
        @GetMapping("/{id}")
        public ResponseEntity<?> getPartnerById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                deliveryPartnerService.getPartnerById(id));
        }

        // ================= REJECT PARTNER =================
        @PutMapping("/reject/{id}")
        public ResponseEntity<?> rejectPartner(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                deliveryPartnerService.rejectPartner(id));
        }

        // ================= GET PENDING PARTNERS =================
        @GetMapping("/pending")
        public ResponseEntity<?> getPendingPartners() {

                return ResponseEntity.ok(
                                deliveryPartnerService.getPendingPartners());
        }
}