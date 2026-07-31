package com.ecommerce.cart_service.service;

import java.util.List;

import com.ecommerce.cart_service.dto.CartRequest;
import com.ecommerce.cart_service.dto.CartResponse;
import com.ecommerce.cart_service.dto.UpdateCartRequest;

public interface CartService {

    CartResponse addToCart(Long userId, CartRequest request);

    List<CartResponse> getCart(Long userId);

    CartResponse updateQuantity(Long userId, Long cartId, UpdateCartRequest request);

    void removeItem(Long userId, Long cartId);

    void clearCart(Long userId);
}