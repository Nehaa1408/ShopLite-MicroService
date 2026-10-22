package com.ecommerce.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartResponse {

    private Long cartId;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Integer quantity;

    private Double price;

    private Double subtotal;

    public CartResponse(Long cartId, Long productId, String productName, String imageUrl,
                        Integer quantity, Double price, Double subtotal) {
        this.cartId = cartId;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }
}