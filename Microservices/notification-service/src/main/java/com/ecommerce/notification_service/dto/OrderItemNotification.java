package com.ecommerce.notification_service.dto;

import lombok.Data;

@Data
public class OrderItemNotification {

    private String productName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}