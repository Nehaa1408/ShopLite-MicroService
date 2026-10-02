package com.ecommerce.shoplite.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private String productName;
    private double price;
    private int quantity;
    private String image;
}