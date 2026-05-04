package com.ecommerce.shoplite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.shoplite.entity.Product;
import com.ecommerce.shoplite.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // ADD PRODUCT
    public Product addProduct(Product product) {
        product.setActive(true);
        return productRepository.save(product);
    }

    // ALL PRODUCTS (PAGINATED)
    public Page<Product> getProducts(int page, int size) {
        return productRepository.findByActiveTrue(PageRequest.of(page, size));
    }

    // CATEGORY PRODUCTS
    public Page<Product> getProductsByCategory(String category, int page, int size) {
        return productRepository.findByCategory_NameAndActiveTrue(
                category, PageRequest.of(page, size));
    }

    // HOME PRODUCTS
    public Page<Product> getHomeProducts(int page, int size) {
        return productRepository.findByTypeAndActiveTrue(
                "HOME", PageRequest.of(page, size));
    }

    // BRAND PRODUCTS
    public Page<Product> getBrandProducts(String brand, int page, int size) {
        return productRepository.findByBrandAndTypeAndActiveTrue(
                brand, "BRAND", PageRequest.of(page, size));
    }

    // GET PRODUCT BY ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::isActive) // uses getter → isActive()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));
    }

    // DELETE (SOFT DELETE)
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    // UPDATE PRODUCT
    public Product updateProduct(Long id, Product updated) {

        Product product = getProductById(id);

        if (updated.getName() != null)
            product.setName(updated.getName());

        if (updated.getDescription() != null)
            product.setDescription(updated.getDescription());

        if (updated.getPrice() > 0)
            product.setPrice(updated.getPrice());

        if (updated.getQuantity() >= 0)
            product.setQuantity(updated.getQuantity());

        if (updated.getImageUrl() != null)
            product.setImageUrl(updated.getImageUrl());

        return productRepository.save(product);
    }
}