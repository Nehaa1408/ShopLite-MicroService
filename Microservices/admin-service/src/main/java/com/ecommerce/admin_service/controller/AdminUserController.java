package com.ecommerce.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.admin_service.dto.UserResponse;
import com.ecommerce.admin_service.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(
            @PathVariable String role) {

        return ResponseEntity.ok(adminUserService.getUsersByRole(role));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @PathVariable String keyword) {

        return ResponseEntity.ok(adminUserService.searchUsers(keyword));
    }
}
