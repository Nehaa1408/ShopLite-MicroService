package com.ecommerce.notification_service.dto;

import lombok.Data;

@Data
public class DeliveryOtpNotificationRequest {

    private String email;
    private String name;
    private Long orderId;
    private String otp;
}