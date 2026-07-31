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

    private Integer quantity;

    private Double price;

    private Double subtotal;
}