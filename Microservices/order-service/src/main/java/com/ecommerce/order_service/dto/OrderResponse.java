package com.ecommerce.order_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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