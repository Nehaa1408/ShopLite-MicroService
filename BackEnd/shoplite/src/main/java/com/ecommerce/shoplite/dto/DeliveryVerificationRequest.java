package com.ecommerce.shoplite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryVerificationRequest {

    private String phone;

    private String vehicleType;

    private String vehicleNumber;

    private String licenseNumber;

    private String aadhaarNumber;

    private String profileImage;

    private String documentImage;
}