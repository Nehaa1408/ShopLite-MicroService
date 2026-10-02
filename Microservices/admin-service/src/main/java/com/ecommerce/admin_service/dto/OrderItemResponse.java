package com.ecommerce.admin_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemResponse {

    private Long productId;
    private String productName;
    private double price;
    private int quantity;
    private double subtotal;
    private String image;
}