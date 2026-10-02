package com.ecommerce.admin_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.admin_service.dto.ProductRequest;
import com.ecommerce.admin_service.dto.ProductResponse;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

    @GetMapping("/api/products")
    Page<ProductResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size);

    @GetMapping("/api/products/{id}")
    ProductResponse getProductById(
            @PathVariable Long id);

    @PostMapping("/api/products")
    ProductResponse addProduct(
            @RequestBody ProductRequest request);

    @PutMapping("/api/products/{id}")
    ProductResponse updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request);

    @DeleteMapping("/api/products/{id}")
    String deleteProduct(
            @PathVariable Long id);
}
