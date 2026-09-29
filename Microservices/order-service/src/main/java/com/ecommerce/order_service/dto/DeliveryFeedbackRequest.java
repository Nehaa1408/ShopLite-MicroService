package com.ecommerce.order_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryFeedbackRequest {

    private Long orderId;
    private int rating;
    private String feedback;
}