package com.ecommerce.cart_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.cart_service.dto.CartRequest;
import com.ecommerce.cart_service.dto.CartResponse;
import com.ecommerce.cart_service.dto.UpdateCartRequest;
import com.ecommerce.cart_service.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    // ================= ADD ITEM =================
    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CartRequest request) {

        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    // ================= GET CART =================
    @GetMapping
    public ResponseEntity<List<CartResponse>> getCart(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(cartService.getCart(userId));
    }

    // ================= UPDATE QUANTITY =================
    @PutMapping("/{cartId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long cartId,
            @Valid @RequestBody UpdateCartRequest request) {

        return ResponseEntity.ok(
                cartService.updateQuantity(userId, cartId, request));
    }

    // ================= REMOVE ITEM =================
    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long cartId) {

        cartService.removeItem(userId, cartId);

        return ResponseEntity.ok("Item removed successfully");
    }

    // ================= CLEAR CART =================
    @DeleteMapping
    public ResponseEntity<String> clearCart(
            @RequestHeader("X-User-Id") Long userId) {

        cartService.clearCart(userId);

        return ResponseEntity.ok("Cart cleared successfully");
    }
}