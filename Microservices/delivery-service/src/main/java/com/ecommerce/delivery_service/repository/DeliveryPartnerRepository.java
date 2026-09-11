package com.ecommerce.delivery_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.delivery_service.entity.ApprovalStatus;
import com.ecommerce.delivery_service.entity.AvailabilityStatus;
import com.ecommerce.delivery_service.entity.DeliveryPartner;

public interface DeliveryPartnerRepository
                extends JpaRepository<DeliveryPartner, Long> {

        // FIND PARTNER USING USER SERVICE USER ID
        Optional<DeliveryPartner> findByUserId(Long userId);

        // ALL PARTNERS
        List<DeliveryPartner> findAllByOrderByIdDesc();

        // APPROVAL STATUS
        List<DeliveryPartner> findByApprovalStatus(ApprovalStatus approvalStatus);

        // AVAILABILITY STATUS
        List<DeliveryPartner> findByAvailabilityStatus(
                        AvailabilityStatus availabilityStatus);

        // APPROVED + AVAILABLE PARTNERS
        List<DeliveryPartner> findByApprovalStatusAndAvailabilityStatus(
                        ApprovalStatus approvalStatus,
                        AvailabilityStatus availabilityStatus);
}