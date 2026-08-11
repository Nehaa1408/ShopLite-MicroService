package com.ecommerce.order_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.ecommerce.order_service.dto.CartItemResponse;

@FeignClient(name = "cart-service")
public interface CartClient {

    @GetMapping("/api/cart")
    List<CartItemResponse> getCart(
            @RequestHeader("X-User-Id") Long userId
    );

    @DeleteMapping("/api/cart")
    String clearCart(
            @RequestHeader("X-User-Id") Long userId
    );
}