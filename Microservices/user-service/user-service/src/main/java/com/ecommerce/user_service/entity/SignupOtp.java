package com.ecommerce.user_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "signup_otp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // EMAIL
    @Column(nullable = false, unique = true)
    private String email;

    // NAME
    @Column(nullable = false)
    private String name;

    // ENCODED PASSWORD
    @Column(nullable = false)
    private String password;

    // OTP
    @Column(nullable = false)
    private String otp;

    // OTP EXPIRY
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;
}