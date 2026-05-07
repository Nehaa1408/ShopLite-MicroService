package com.ecommerce.shoplite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryFeedbackRequest {

    private Long orderId;

    private Integer rating;

    private String feedback;
}