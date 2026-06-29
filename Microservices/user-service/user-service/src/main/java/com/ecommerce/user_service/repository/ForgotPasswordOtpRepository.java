package com.ecommerce.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.user_service.entity.ForgotPasswordOtp;

public interface ForgotPasswordOtpRepository
        extends JpaRepository<ForgotPasswordOtp, Long> {

    Optional<ForgotPasswordOtp> findByEmail(String email);
}