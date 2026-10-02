package com.ecommerce.shoplite.repository;

import com.ecommerce.shoplite.entity.DeliveryOtp;
import com.ecommerce.shoplite.entity.Order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryOtpRepository
        extends JpaRepository<DeliveryOtp, Long> {

    // GET LATEST OTP FOR ORDER
    Optional<DeliveryOtp> findTopByOrderOrderByCreatedAtDesc(Order order);
}