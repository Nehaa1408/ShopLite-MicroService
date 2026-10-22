package com.ecommerce.order_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartItemResponse {

    private Long id;

    private Long productId;

    private int quantity;

    private double price;

    private double subtotal;

    public CartItemResponse(Long id, Long productId, int quantity, double price, double subtotal) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }
}