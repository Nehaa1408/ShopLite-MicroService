package com.ecommerce.shoplite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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