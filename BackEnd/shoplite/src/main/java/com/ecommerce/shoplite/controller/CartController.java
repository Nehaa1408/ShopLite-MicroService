package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.CartRequest;
import com.ecommerce.shoplite.dto.CartResponse;
import com.ecommerce.shoplite.service.CartService;
import com.ecommerce.shoplite.security.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CartService cartService;

  
    private String extractUserEmail(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing token");
        }
        return jwtUtil.extractEmail(token.substring(7));
    }

    
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request,
            @RequestHeader("Authorization") String token) {

        String email = extractUserEmail(token);

        CartResponse response = cartService.addItem(
                email,
                request.getProductId(),
                request.getQuantity()
        );

        return ResponseEntity.ok(response);
    }

    
    @GetMapping
    public ResponseEntity<List<CartResponse>> getCart(
            @RequestHeader("Authorization") String token) {

        String email = extractUserEmail(token);
        return ResponseEntity.ok(cartService.getCart(email));
    }

    
    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateQuantity(
            @Valid @RequestBody CartRequest request,
            @RequestHeader("Authorization") String token) {

        String email = extractUserEmail(token);

        CartResponse response = cartService.updateQuantity(
                email,
                request.getProductId(),
                request.getQuantity()
        );

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeItem(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {

        String email = extractUserEmail(token);
        cartService.removeItem(email, productId);

        return ResponseEntity.ok("Item removed successfully");
    }

   
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(
            @RequestHeader("Authorization") String token) {

        String email = extractUserEmail(token);
        cartService.clearCart(email);

        return ResponseEntity.ok("Cart cleared successfully");
    }
}