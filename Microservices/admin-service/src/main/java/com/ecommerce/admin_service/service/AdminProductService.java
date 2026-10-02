package com.ecommerce.admin_service.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ecommerce.admin_service.client.ProductClient;
import com.ecommerce.admin_service.dto.ProductRequest;
import com.ecommerce.admin_service.dto.ProductResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductClient productClient;

    public Page<ProductResponse> getProducts(int page, int size) {

        return productClient.getProducts(page, size);
    }

    public ProductResponse getProductById(Long id) {

        return productClient.getProductById(id);
    }

    public ProductResponse addProduct(ProductRequest request) {

        return productClient.addProduct(request);
    }

    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        return productClient.updateProduct(id, request);
    }

    public String deleteProduct(Long id) {

        return productClient.deleteProduct(id);
    }
}