package com.ecommerce.shoplite.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryFeedbackResponse {

    private Long id;

    private Long orderId;

    private Integer rating;

    private String feedback;

    private String customerName;

    private String deliveryPartnerName;
}