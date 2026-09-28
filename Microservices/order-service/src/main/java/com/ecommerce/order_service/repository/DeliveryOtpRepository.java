package com.ecommerce.order_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.order_service.entity.DeliveryOtp;

public interface DeliveryOtpRepository
        extends JpaRepository<DeliveryOtp, Long> {

    Optional<DeliveryOtp> findTopByOrderIdOrderByCreatedAtDesc(Long orderId);
}