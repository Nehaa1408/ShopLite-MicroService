package com.ecommerce.product_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.product_service.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategory_NameAndActiveTrue(String categoryName, Pageable pageable);

    Page<Product> findByBrandAndTypeAndActiveTrue(String brand, String type, Pageable pageable);

    Page<Product> findByTypeAndActiveTrue(String type, Pageable pageable);

}