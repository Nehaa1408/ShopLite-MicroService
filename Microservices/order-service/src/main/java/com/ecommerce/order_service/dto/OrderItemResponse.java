package com.ecommerce.order_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderItemResponse {

    private Long productId;

    private String productName;

    private double price;

    private int quantity;

    private double subtotal;

    private String image;

    private boolean cancelled;
    private String cancellationReason;

    public OrderItemResponse(Long productId, String productName, double price, int quantity, double subtotal,
            String image) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.image = image;
        this.cancelled = false;
        this.cancellationReason = null;
    }
}