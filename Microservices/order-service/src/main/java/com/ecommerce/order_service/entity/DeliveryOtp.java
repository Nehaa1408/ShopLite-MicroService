package com.ecommerce.order_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "delivery_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // LINK TO ORDER
    @Column(name = "order_id", nullable = false)
    private Long orderId;

    // 6 DIGIT OTP
    @Column(nullable = false, length = 6)
    private String otp;

    // OTP EXPIRY
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // USED OR NOT
    @Column(nullable = false)
    private boolean verified = false;

    // WRONG ATTEMPTS
    @Column(nullable = false)
    private int attempts = 0;

    // CREATED TIME
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}