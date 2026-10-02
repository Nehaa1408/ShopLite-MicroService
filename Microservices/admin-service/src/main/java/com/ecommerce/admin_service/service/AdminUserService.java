package com.ecommerce.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.admin_service.client.UserClient;
import com.ecommerce.admin_service.dto.UserResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserClient userClient;

    public List<UserResponse> getAllUsers() {
        return userClient.getAllUsers();
    }

    public List<UserResponse> getUsersByRole(String role) {
        return userClient.getUsersByRole(role);
    }

    public List<UserResponse> searchUsers(String keyword) {
        return userClient.searchUsers(keyword);
    }
}
