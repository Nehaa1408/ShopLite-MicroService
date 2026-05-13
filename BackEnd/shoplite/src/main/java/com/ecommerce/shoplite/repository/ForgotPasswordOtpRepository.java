package com.ecommerce.shoplite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.ForgotPasswordOtp;

public interface ForgotPasswordOtpRepository
        extends JpaRepository<ForgotPasswordOtp, Long> {

    Optional<ForgotPasswordOtp> findByEmail(String email);
}