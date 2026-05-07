package com.ecommerce.shoplite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.SignupOtp;

public interface SignupOtpRepository
        extends JpaRepository<SignupOtp, Long> {

    Optional<SignupOtp> findByEmail(String email);
}