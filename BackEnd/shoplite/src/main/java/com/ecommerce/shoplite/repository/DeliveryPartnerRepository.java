package com.ecommerce.shoplite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.DeliveryPartner;
import com.ecommerce.shoplite.entity.User;

public interface DeliveryPartnerRepository
        extends JpaRepository<DeliveryPartner, Long> {

    Optional<DeliveryPartner> findByUser(User user);

    // ALL PARTNERS
    List<DeliveryPartner> findAllByOrderByIdDesc();

    List<DeliveryPartner> findByApprovedTrue();

    // PENDING PARTNERS
    List<DeliveryPartner> findByApprovedFalse();

    List<DeliveryPartner> findByApprovedTrueAndActiveTrue();

}