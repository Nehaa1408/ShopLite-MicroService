package com.ecommerce.order_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderResponse {

    private Long orderId;

    private Long userId;

    private Long deliveryPartnerId;

    private String customerName;

    private String customerEmail;

    private String deliveryAgentName;

    private String deliveryAgentEmail;

    private double totalAmount;

    private String status;

    private String orderDate;

    private List<OrderItemResponse> items;

    private String cancelReason;

    private String deliveredAt;

    private String paymentMethod;

    private String paymentStatus;

    public OrderResponse(Long orderId, Long userId, Long deliveryPartnerId,
                         String customerName, String customerEmail,
                         String deliveryAgentName, String deliveryAgentEmail,
                         double totalAmount, String status, String orderDate,
                         List<OrderItemResponse> items, String cancelReason,
                         String deliveredAt, String paymentMethod, String paymentStatus) {
        this.orderId = orderId;
        this.userId = userId;
        this.deliveryPartnerId = deliveryPartnerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.deliveryAgentName = deliveryAgentName;
        this.deliveryAgentEmail = deliveryAgentEmail;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.items = items;
        this.cancelReason = cancelReason;
        this.deliveredAt = deliveredAt;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }
}