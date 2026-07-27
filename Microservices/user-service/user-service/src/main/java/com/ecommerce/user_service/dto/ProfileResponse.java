package com.ecommerce.user_service.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final Role role;
    private final Provider provider;
}