package com.ecommerce.order_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "return_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ORDER ID
    @Column(name = "order_id", nullable = false)
    private Long orderId;

    // CUSTOMER ID
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // PICKUP PARTNER ID
    @Column(name = "pickup_partner_id")
    private Long pickupPartnerId;

    // RETURN REASON
    @Column(length = 1000)
    private String returnReason;

    // RETURN STATUS
    @Enumerated(EnumType.STRING)
    private ReturnStatus status;

    // RETURN REQUEST DATE
    private LocalDateTime requestedDate;

    // RETURNED ITEMS
    @Column(length = 3000)
    private String selectedItems;

    // REFUND AMOUNT
    private double refundAmount;

    // PICKUP OTP
    private String pickupOtp;

    // OTP EXPIRY
    private LocalDateTime pickupOtpExpiry;

    @PrePersist
    protected void onCreate() {

        this.requestedDate = LocalDateTime.now();

        if (this.status == null) {
            this.status = ReturnStatus.RETURN_REQUESTED;
        }
    }
}