package com.ecommerce.shoplite.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private double totalAmount;
    private String status;
    private String orderDate;
    private List<OrderItemResponse> items;
    private String deliveryAgentName;
    private String customerName;
    private String customerEmail;
    private String deliveryAgentEmail;
    private String cancelReason;
    private Integer deliveryRating;
    private String deliveryFeedback;
    private String deliveredAt;
    private boolean returnEligible;
    private String returnEligibleTill;
    private String transactionId;
    private String paymentScreenshot;
    private String paymentMethod;
    private String paymentStatus;
}