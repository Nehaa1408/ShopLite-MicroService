package com.ecommerce.notification_service.dto;

import lombok.Data;

@Data
public class OrderStatusNotificationRequest {

    private String email;
    private String name;
    private Long orderId;
    private String orderStatus;
}