package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.CartRequest;
import com.ecommerce.shoplite.dto.CartResponse;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // ADD
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                cartService.addItem(user, request.getProductId(), request.getQuantity()));
    }

    // GET
    @GetMapping
    public ResponseEntity<List<CartResponse>> getCart(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(cartService.getCart(user));
    }

    // UPDATE
    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateQuantity(
            @Valid @RequestBody CartRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                cartService.updateQuantity(user, request.getProductId(), request.getQuantity()));
    }

    // REMOVE
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeItem(
            @PathVariable Long productId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        cartService.removeItem(user, productId);

        return ResponseEntity.ok("Item removed successfully");
    }

    // CLEAR
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        cartService.clearCart(user);

        return ResponseEntity.ok("Cart cleared successfully");
    }
}