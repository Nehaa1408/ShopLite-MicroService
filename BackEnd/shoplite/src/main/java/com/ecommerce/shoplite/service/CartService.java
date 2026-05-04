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

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    // ================= ADD ITEM =================
    public CartResponse addItem(User user, Long productId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

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

    // ================= GET CART =================
    public List<CartResponse> getCart(User user) {

        return cartRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= UPDATE QUANTITY =================
    public CartResponse updateQuantity(User user, Long productId, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        cartItem.setQuantity(quantity);

        return mapToDTO(cartRepository.save(cartItem));
    }

    // ================= REMOVE ITEM =================
    public void removeItem(User user, Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartRepository.delete(cartItem);
    }

    // ================= CLEAR CART =================
    public void clearCart(User user) {
        cartRepository.deleteByUser(user);
    }

    // ================= DTO MAPPER =================
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