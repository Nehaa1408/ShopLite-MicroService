package com.ecommerce.product_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.ecommerce.product_service.dto.ProductRequest;
import com.ecommerce.product_service.dto.ProductResponse;
import com.ecommerce.product_service.entity.Category;
import com.ecommerce.product_service.entity.Product;
import com.ecommerce.product_service.exception.ProductNotFoundException;
import com.ecommerce.product_service.mapper.ProductMapper;
import com.ecommerce.product_service.repository.CategoryRepository;
import com.ecommerce.product_service.repository.ProductRepository;

@Service
public class ProductService {

    private static final String HOME = "HOME";
    private static final String BRAND = "BRAND";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    // ADD PRODUCT
    public ProductResponse addProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setType(request.getType());
        product.setCategory(category);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    // GET ALL PRODUCTS
    public Page<ProductResponse> getProducts(int page, int size) {

        PageRequest pageable = PageRequest.of(page, size);

        return productRepository.findByActiveTrue(pageable)
                .map(productMapper::toResponse);
    }

    // GET PRODUCTS BY CATEGORY
    public Page<ProductResponse> getProductsByCategory(String category, int page, int size) {

        PageRequest pageable = PageRequest.of(page, size);

        return productRepository.findByCategory_NameAndActiveTrue(category, pageable)
                .map(productMapper::toResponse);
    }

    // GET HOME PRODUCTS
    public Page<ProductResponse> getHomeProducts(int page, int size) {

        PageRequest pageable = PageRequest.of(page, size);

        return productRepository.findByTypeAndActiveTrue(HOME, pageable)
                .map(productMapper::toResponse);
    }

    // GET BRAND PRODUCTS
    public Page<ProductResponse> getBrandProducts(String brand, int page, int size) {

        PageRequest pageable = PageRequest.of(page, size);

        return productRepository.findByBrandAndTypeAndActiveTrue(
                brand,
                BRAND,
                pageable)
                .map(productMapper::toResponse);
    }

    // GET PRODUCT BY ID
    // GET PRODUCT ENTITY BY ID (Internal Use)
    private Product findProductById(Long id) {

        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with ID : " + id));
    }

    // GET PRODUCT BY ID
    public ProductResponse getProductById(Long id) {

        Product product = findProductById(id);

        return productMapper.toResponse(product);
    }

    // UPDATE PRODUCT
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product existingProduct = findProductById(id);

        if (request.getName() != null && !request.getName().isBlank()) {
            existingProduct.setName(request.getName());
        }

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            existingProduct.setDescription(request.getDescription());
        }

        if (request.getPrice() > 0) {
            existingProduct.setPrice(request.getPrice());
        }

        if (request.getQuantity() >= 0) {
            existingProduct.setQuantity(request.getQuantity());
        }

        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            existingProduct.setImageUrl(request.getImageUrl());
        }

        if (request.getCategoryId() != null) {

            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            existingProduct.setCategory(category);
        }

        if (request.getBrand() != null && !request.getBrand().isBlank()) {
            existingProduct.setBrand(request.getBrand());
        }

        if (request.getType() != null && !request.getType().isBlank()) {
            existingProduct.setType(request.getType());
        }

        Product updatedProduct = productRepository.save(existingProduct);

        return productMapper.toResponse(updatedProduct);
    }

    // SOFT DELETE PRODUCT
    public void deleteProduct(Long id) {

        Product product = findProductById(id);

        product.setActive(false);

        productRepository.save(product);
    }
}