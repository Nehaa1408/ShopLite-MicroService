package com.ecommerce.shoplite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryRegisterRequest {

    // USER DETAILS
    private String name;
    private String email;
    private String password;

    // DELIVERY DETAILS
    private String phone;

    private String vehicleType;
    private String vehicleNumber;

    private String licenseNumber;
    private String aadhaarNumber;

    // IMAGE PATHS
    private String profileImage;
    private String documentImage;
}