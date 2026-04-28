package com.ecommerce.shoplite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.shoplite.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}