package com.ecommerce.shoplite.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long productId;
    private String productName;
    private double price;
    private int quantity;
    private String imageUrl;
}