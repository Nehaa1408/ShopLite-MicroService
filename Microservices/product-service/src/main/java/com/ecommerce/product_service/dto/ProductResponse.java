package com.ecommerce.product_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private double price;

    private int quantity;

    private String imageUrl;

    private Long categoryId;

    private String categoryName;

    private String brand;

    private String type;

    private boolean active;
}