package com.ecommerce.order_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {

    private String paymentMethod;

    private String paymentScreenshot;
}