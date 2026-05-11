package com.ecommerce.shoplite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {

    private String paymentMethod;
    private String paymentScreenshot;
}