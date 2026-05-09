package com.ecommerce.shoplite.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

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

    // ORDER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // CUSTOMER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // PICKUP PARTNER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_partner_id")
    private User pickupPartner;

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