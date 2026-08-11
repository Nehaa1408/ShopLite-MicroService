package com.ecommerce.order_service.entity;

public enum OrderStatus {

    PENDING,
    PLACED,
    CONFIRMED,
    PACKED,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    DELIVERY_FAILED
}