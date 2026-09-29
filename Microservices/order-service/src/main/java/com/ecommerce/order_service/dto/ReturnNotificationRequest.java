package com.ecommerce.order_service.dto;

import lombok.Data;

@Data
public class ReturnNotificationRequest {

    private String email;
    private String name;
    private Long returnId;
    private Long orderId;
    private String status;
    private double refundAmount;
}