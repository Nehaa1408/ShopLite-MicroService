package com.ecommerce.shoplite.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.CartResponse;
import com.ecommerce.shoplite.entity.Cart;
import com.ecommerce.shoplite.entity.Product;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.CartRepository;
import com.ecommerce.shoplite.repository.ProductRepository;
import com.ecommerce.shoplite.repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public CartResponse addItem(String email, Long productId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new Cart();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        }

        return mapToDTO(cartRepository.save(cartItem));
    }

    public List<CartResponse> getCart(String email) {

        User user = getUserByEmail(email);

        return cartRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CartResponse updateQuantity(String email, Long productId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        cartItem.setQuantity(quantity);

        return mapToDTO(cartRepository.save(cartItem));
    }

    public void removeItem(String email, Long productId) {

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartRepository.delete(cartItem);
    }

    public void clearCart(String email) {

        User user = getUserByEmail(email);
        cartRepository.deleteByUser(user);
    }

    private CartResponse mapToDTO(Cart item) {

        CartResponse dto = new CartResponse();

        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setPrice(item.getProduct().getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setImageUrl(item.getProduct().getImageUrl());

        return dto;
    }
}