package com.ecommerce.product_service.mapper;

import org.springframework.stereotype.Component;

import com.ecommerce.product_service.dto.ProductResponse;
import com.ecommerce.product_service.entity.Product;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {

        if (product == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setImageUrl(product.getImageUrl());
        response.setBrand(product.getBrand());
        response.setType(product.getType());
        response.setActive(product.isActive());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }

        return response;
    }
}