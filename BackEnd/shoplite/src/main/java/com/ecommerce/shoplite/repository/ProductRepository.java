package com.ecommerce.shoplite.repository;

import com.ecommerce.shoplite.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByBrandAndTypeAndIsActiveTrue(String brand, String type, Pageable pageable);

    Page<Product> findByCategory_NameAndIsActiveTrue(String categoryName, Pageable pageable);

    Page<Product> findByTypeAndIsActiveTrue(String type, Pageable pageable);

    List<Product> findByBrandAndIsActiveTrue(String brand);
}