package com.ecommerce.order_service.dto;

import lombok.Data;

@Data
public class PaymentNotificationRequest {

    private String email;
    private String name;
    private Long orderId;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
}