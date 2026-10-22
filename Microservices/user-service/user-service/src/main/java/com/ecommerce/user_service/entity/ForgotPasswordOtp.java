package com.ecommerce.user_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ForgotPasswordOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String otp;

    private LocalDateTime expiryTime;

    public ForgotPasswordOtp(Long id, String email, String otp, LocalDateTime expiryTime) {
        this.id = id;
        this.email = email;
        this.otp = otp;
        this.expiryTime = expiryTime;
    }
}