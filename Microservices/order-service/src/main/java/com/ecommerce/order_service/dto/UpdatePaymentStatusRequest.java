package com.ecommerce.order_service.dto;

import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {

    private String paymentStatus;
}