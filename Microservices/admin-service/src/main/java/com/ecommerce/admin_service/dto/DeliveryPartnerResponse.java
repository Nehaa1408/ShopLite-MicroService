package com.ecommerce.admin_service.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
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

    public DeliveryPartnerResponse(Long id, Long userId, String phone, String profileImage,
            String vehicleType, String vehicleNumber, String licenseNumber, String aadhaarNumber,
            String drivingLicenseImage, String aadhaarImage, String vehicleRcImage,
            ApprovalStatus approvalStatus, AvailabilityStatus availabilityStatus, double rating,
            int completedDeliveries, LocalDate joinedDate) {
        this.id = id;
        this.userId = userId;
        this.phone = phone;
        this.profileImage = profileImage;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.licenseNumber = licenseNumber;
        this.aadhaarNumber = aadhaarNumber;
        this.drivingLicenseImage = drivingLicenseImage;
        this.aadhaarImage = aadhaarImage;
        this.vehicleRcImage = vehicleRcImage;
        this.approvalStatus = approvalStatus;
        this.availabilityStatus = availabilityStatus;
        this.rating = rating;
        this.completedDeliveries = completedDeliveries;
        this.joinedDate = joinedDate;
    }
}
