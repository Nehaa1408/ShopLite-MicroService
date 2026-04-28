package com.ecommerce.shoplite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.Cart;
import com.ecommerce.shoplite.entity.Product;
import com.ecommerce.shoplite.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

   
    List<Cart> findByUser(User user);

    void deleteByUser(User user);

    void deleteByUserAndProduct_Id(User user, Long productId);

    
    Optional<Cart> findByUserAndProduct(User user, Product product);
}