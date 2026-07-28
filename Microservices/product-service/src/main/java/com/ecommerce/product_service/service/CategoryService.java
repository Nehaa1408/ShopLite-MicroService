package com.ecommerce.product_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.product_service.entity.Category;
import com.ecommerce.product_service.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}