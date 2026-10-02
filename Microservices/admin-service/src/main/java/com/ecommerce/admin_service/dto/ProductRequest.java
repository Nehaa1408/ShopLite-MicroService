package com.ecommerce.admin_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    private String name;

    private String description;

    private double price;

    private int quantity;

    private String imageUrl;

    private Long categoryId;

    private String brand;

    private String type;
}