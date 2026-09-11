package com.ecommerce.delivery_service.service;

import org.springframework.stereotype.Service;

import com.ecommerce.delivery_service.dto.DeliveryVerificationRequest;
import com.ecommerce.delivery_service.entity.ApprovalStatus;
import com.ecommerce.delivery_service.entity.AvailabilityStatus;
import com.ecommerce.delivery_service.entity.DeliveryPartner;
import com.ecommerce.delivery_service.repository.DeliveryPartnerRepository;

@Service
public class DeliveryPartnerService {

        private final DeliveryPartnerRepository deliveryPartnerRepository;

        public DeliveryPartnerService(
                        DeliveryPartnerRepository deliveryPartnerRepository) {

                this.deliveryPartnerRepository = deliveryPartnerRepository;
        }

        // ================= APPLY FOR DELIVERY PARTNER =================

        public DeliveryPartner createDeliveryPartner(Long userId) {

                // CHECK WHETHER USER HAS ALREADY APPLIED
                return deliveryPartnerRepository.findByUserId(userId)
                                .orElseGet(() -> {

                                        DeliveryPartner partner = new DeliveryPartner();

                                        // LINK TO EXISTING USER SERVICE USER
                                        partner.setUserId(userId);

                                        // INITIAL STATUS
                                        partner.setApprovalStatus(
                                                        ApprovalStatus.PENDING);

                                        partner.setAvailabilityStatus(
                                                        AvailabilityStatus.OFFLINE);

                                        // DEFAULT METRICS
                                        partner.setRating(5.0);

                                        partner.setCompletedDeliveries(0);

                                        return deliveryPartnerRepository.save(partner);
                                });
        }

        // ================= UPDATE DELIVERY PROFILE =================

        public DeliveryPartner updateVerificationProfile(
                        Long userId,
                        DeliveryVerificationRequest request) {

                DeliveryPartner partner = deliveryPartnerRepository
                                .findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                // UPDATE DETAILS
                partner.setPhone(request.getPhone());

                partner.setVehicleType(
                                request.getVehicleType());

                partner.setVehicleNumber(
                                request.getVehicleNumber());

                partner.setLicenseNumber(
                                request.getLicenseNumber());

                partner.setAadhaarNumber(
                                request.getAadhaarNumber());

                // UPDATE DOCUMENTS
                partner.setProfileImage(
                                request.getProfileImage());

                partner.setDrivingLicenseImage(
                                request.getDrivingLicenseImage());

                partner.setAadhaarImage(
                                request.getAadhaarImage());

                partner.setVehicleRcImage(
                                request.getVehicleRcImage());

                // RESUBMISSION / APPLICATION
                // ADMIN MUST REVIEW AGAIN
                partner.setApprovalStatus(
                                ApprovalStatus.PENDING);

                // Partner is not available while waiting
                // for admin approval.
                partner.setAvailabilityStatus(
                                AvailabilityStatus.OFFLINE);

                return deliveryPartnerRepository.save(partner);
        }

        // ================= GET DELIVERY PROFILE =================

        public DeliveryPartner getByUserId(Long userId) {

                return deliveryPartnerRepository
                                .findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));
        }

        // ================= GET PENDING PARTNERS =================

        public java.util.List<DeliveryPartner> getPendingPartners() {

                return deliveryPartnerRepository
                                .findByApprovalStatus(
                                                ApprovalStatus.PENDING);
        }

        // ================= APPROVE DELIVERY PARTNER =================

        public DeliveryPartner approvePartner(Long id) {

                DeliveryPartner partner = deliveryPartnerRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                partner.setApprovalStatus(
                                ApprovalStatus.APPROVED);

                partner.setAvailabilityStatus(
                                AvailabilityStatus.OFFLINE);

                return deliveryPartnerRepository.save(partner);
        }

        // ================= REJECT DELIVERY PARTNER =================

        public DeliveryPartner rejectPartner(Long id) {

                DeliveryPartner partner = deliveryPartnerRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Delivery partner not found"));

                partner.setApprovalStatus(
                                ApprovalStatus.REJECTED);

                partner.setAvailabilityStatus(
                                AvailabilityStatus.OFFLINE);

                return deliveryPartnerRepository.save(partner);
        }
}