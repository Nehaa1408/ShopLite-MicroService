package com.ecommerce.notification_service.dto;

import lombok.Data;

@Data
public class ReturnPickupOtpNotificationRequest {

    private String email;
    private String name;
    private Long returnId;
    private Long orderId;
    private String otp;
}
