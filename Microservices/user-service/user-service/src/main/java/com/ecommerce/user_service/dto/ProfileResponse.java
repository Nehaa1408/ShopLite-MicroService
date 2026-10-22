package com.ecommerce.user_service.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.Getter;

@Getter
public class ProfileResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final Role role;
    private final Provider provider;

    public ProfileResponse(Long id, String name, String email, Role role, Provider provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
    }
}