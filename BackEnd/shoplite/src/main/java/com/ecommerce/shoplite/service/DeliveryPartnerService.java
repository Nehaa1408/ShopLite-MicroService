package com.ecommerce.shoplite.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.DeliveryRegisterRequest;
import com.ecommerce.shoplite.dto.DeliveryRegisterResponse;
import com.ecommerce.shoplite.dto.DeliveryVerificationRequest;
import com.ecommerce.shoplite.entity.DeliveryPartner;
import com.ecommerce.shoplite.entity.Provider;
import com.ecommerce.shoplite.entity.Role;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.DeliveryPartnerRepository;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;

@Service
public class DeliveryPartnerService {

        @Autowired
        private DeliveryPartnerRepository deliveryPartnerRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtil jwtUtil;

        // ================= REGISTER DELIVERY PARTNER =================
        public DeliveryRegisterResponse registerDeliveryPartner(
                        DeliveryRegisterRequest request) {

                // EMAIL EXISTS?
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {

                        throw new RuntimeException(
                                        "Email already registered");
                }

                // ================= CREATE USER =================
                User user = new User();

                user.setName(request.getName());

                user.setEmail(request.getEmail());

                // ENCODE PASSWORD
                user.setPassword(
                                passwordEncoder.encode(
                                                request.getPassword()));

                user.setRole(Role.DELIVERY);

                user.setProvider(Provider.LOCAL);

                User savedUser = userRepository.save(user);

                // ================= CREATE DELIVERY PARTNER =================
                DeliveryPartner partner = new DeliveryPartner();

                partner.setUser(savedUser);

                // ONLY BASIC DETAILS DURING SIGNUP
                partner.setPhone(request.getPhone());

                // VERIFICATION DETAILS
                // WILL BE FILLED LATER
                partner.setVehicleType(null);

                partner.setVehicleNumber(null);

                partner.setLicenseNumber(null);

                partner.setAadhaarNumber(null);
                partner.setProfileImage(null);

                partner.setDrivingLicenseImage(null);

                partner.setAadhaarImage(null);

                partner.setVehicleRcImage(null);

                // DEFAULT STATES
                partner.setApproved(false);

                // IMPORTANT
                partner.setRejected(false);

                // ACCOUNT INACTIVE UNTIL APPROVED
                partner.setActive(false);

                // DEFAULT METRICS
                partner.setRating(5.0);

                partner.setCompletedDeliveries(0);

                DeliveryPartner savedPartner = deliveryPartnerRepository.save(partner);

                // ================= GENERATE JWT TOKEN =================
                String token = jwtUtil.generateToken(
                                savedUser.getEmail());

                // ================= RESPONSE =================
                return new DeliveryRegisterResponse(
                                savedPartner.getId(),
                                savedUser.getName(),
                                savedUser.getEmail(),
                                savedUser.getRole(),
                                savedUser.getProvider(),
                                token,
                                "Registration successful. Complete your verification profile.",
                                savedPartner.isApproved());
        }

        // ================= APPROVE DELIVERY PARTNER =================
        public DeliveryPartner approvePartner(Long id) {

                DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                // APPROVE
                partner.setApproved(true);

                // REMOVE REJECT STATE
                partner.setRejected(false);

                // ACTIVATE ACCOUNT
                partner.setActive(true);

                return deliveryPartnerRepository.save(partner);
        }

        // ================= GET ALL DELIVERY PARTNERS =================
        public java.util.List<DeliveryPartner> getAllPartners() {

                return deliveryPartnerRepository
                                .findAllByOrderByIdDesc();
        }

        // ================= GET PARTNER BY ID =================
        public DeliveryPartner getPartnerById(Long id) {

                return deliveryPartnerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));
        }

        // ================= REJECT DELIVERY PARTNER =================
        public DeliveryPartner rejectPartner(Long id) {

                DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                // REJECT
                partner.setApproved(false);

                partner.setRejected(true);

                // DEACTIVATE
                partner.setActive(false);

                return deliveryPartnerRepository.save(partner);
        }

        // ================= GET PENDING PARTNERS =================
        public java.util.List<DeliveryPartner> getPendingPartners() {

                return deliveryPartnerRepository
                                .findByApprovedFalse();
        }

        // ================= GET DELIVERY PARTNER =================
        public DeliveryPartner getByUser(User user) {

                return deliveryPartnerRepository
                                .findByUser(user)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));
        }

        // ================= CREATE DELIVERY PROFILE =================
        public DeliveryPartner createDeliveryPartner(
                        User user) {

                Optional<DeliveryPartner> existing = deliveryPartnerRepository.findByUser(user);

                if (existing.isPresent()) {

                        return existing.get();
                }

                DeliveryPartner partner = new DeliveryPartner();

                partner.setUser(user);

                // DEFAULTS
                partner.setApproved(false);

                partner.setRejected(false);

                partner.setActive(false);

                return deliveryPartnerRepository.save(partner);
        }

        // ================= UPDATE VERIFICATION PROFILE =================
        public DeliveryPartner updateVerificationProfile(
                        User user,
                        DeliveryVerificationRequest request) {

                DeliveryPartner partner = deliveryPartnerRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                // UPDATE DETAILS
                partner.setPhone(
                                request.getPhone());

                partner.setVehicleType(
                                request.getVehicleType());

                partner.setVehicleNumber(
                                request.getVehicleNumber());

                partner.setLicenseNumber(
                                request.getLicenseNumber());

                partner.setAadhaarNumber(
                                request.getAadhaarNumber());

                partner.setProfileImage(
                                request.getProfileImage());

                partner.setDrivingLicenseImage(
                                request.getDrivingLicenseImage());

                partner.setAadhaarImage(
                                request.getAadhaarImage());

                partner.setVehicleRcImage(
                                request.getVehicleRcImage());

                // RESET REJECTION WHEN RESUBMITTED
                partner.setRejected(false);

                return deliveryPartnerRepository.save(partner);
        }
}