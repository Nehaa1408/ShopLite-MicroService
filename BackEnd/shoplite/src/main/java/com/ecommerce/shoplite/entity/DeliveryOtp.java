package com.ecommerce.shoplite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

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