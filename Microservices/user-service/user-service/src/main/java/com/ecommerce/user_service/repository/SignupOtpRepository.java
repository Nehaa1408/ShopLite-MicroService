package com.ecommerce.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.user_service.entity.SignupOtp;

public interface SignupOtpRepository
        extends JpaRepository<SignupOtp, Long> {

    Optional<SignupOtp> findByEmail(String email);
}