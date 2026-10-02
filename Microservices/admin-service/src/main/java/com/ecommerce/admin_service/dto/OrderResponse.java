package com.ecommerce.admin_service.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderResponse {

    private Long orderId;
    private Long userId;
    private Long deliveryPartnerId;
    private double totalAmount;
    private String status;
    private String orderDate;
    private List<OrderItemResponse> items;
    private String cancelReason;
    private String deliveredAt;
    private String paymentMethod;
    private String paymentStatus;
}