package com.ecommerce.order_service.dto;

import java.util.List;

import lombok.Data;

@Data
public class OrderPlacedNotificationRequest {

    private String email;
    private String name;
    private Long orderId;
    private Double totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private List<OrderItemNotification> items;
}