package com.ecommerce.admin_service.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerResponse {

    private Long id;

    private Long userId;

    private String phone;

    private String profileImage;

    private String vehicleType;

    private String vehicleNumber;

    private String licenseNumber;

    private String aadhaarNumber;

    private String drivingLicenseImage;

    private String aadhaarImage;

    private String vehicleRcImage;

    private ApprovalStatus approvalStatus;

    private AvailabilityStatus availabilityStatus;

    private double rating;

    private int completedDeliveries;

    private LocalDate joinedDate;
}
