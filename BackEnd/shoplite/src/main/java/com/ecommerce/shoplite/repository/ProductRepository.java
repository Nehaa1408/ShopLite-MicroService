package com.ecommerce.shoplite.repository;

import com.ecommerce.shoplite.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);

}