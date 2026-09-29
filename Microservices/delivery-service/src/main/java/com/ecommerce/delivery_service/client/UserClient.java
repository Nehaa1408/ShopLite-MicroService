package com.ecommerce.delivery_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ecommerce.delivery_service.dto.UserResponse;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/{userId}")
    UserResponse getUserById(@PathVariable Long userId);
}