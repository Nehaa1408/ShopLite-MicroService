package com.ecommerce.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ecommerce.admin_service.dto.UserResponse;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @GetMapping("/api/user/admin")
    List<UserResponse> getAllUsers();

    @GetMapping("/api/user/admin/role/{role}")
    List<UserResponse> getUsersByRole(@PathVariable String role);

    @GetMapping("/api/user/admin/search/{keyword}")
    List<UserResponse> searchUsers(@PathVariable String keyword);
}
