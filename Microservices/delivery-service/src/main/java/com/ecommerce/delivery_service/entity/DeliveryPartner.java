package com.ecommerce.delivery_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "delivery_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER SERVICE USER ID
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // DELIVERY PARTNER DETAILS
    @Column(length = 20)
    private String phone;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    // VEHICLE DETAILS
    @Column(length = 50)
    private String vehicleType;

    @Column(length = 30)
    private String vehicleNumber;

    @Column(length = 50)
    private String licenseNumber;

    // IDENTITY DETAILS
    @Column(length = 20)
    private String aadhaarNumber;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String drivingLicenseImage;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String aadhaarImage;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String vehicleRcImage;

    // APPROVAL / AVAILABILITY
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.OFFLINE;

    // DELIVERY METRICS
    private double rating = 5.0;

    private int completedDeliveries = 0;

    // JOIN DATE
    private LocalDate joinedDate;

    @PrePersist
    protected void onCreate() {
        this.joinedDate = LocalDate.now();
    }
}
