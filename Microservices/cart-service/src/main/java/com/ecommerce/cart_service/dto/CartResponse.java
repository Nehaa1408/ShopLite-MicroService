package com.ecommerce.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long cartId;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Integer quantity;

    private Double price;

    private Double subtotal;
}