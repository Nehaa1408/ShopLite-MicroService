package com.ecommerce.product_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.product_service.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}