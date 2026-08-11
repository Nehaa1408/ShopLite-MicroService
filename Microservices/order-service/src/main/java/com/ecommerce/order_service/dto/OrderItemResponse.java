package com.ecommerce.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private Long productId;

    private String productName;

    private double price;

    private int quantity;

    private double subtotal;

    private String image;
}