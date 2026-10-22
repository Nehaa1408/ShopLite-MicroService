package com.ecommerce.user_service.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;

    public RegisterResponse(Long id, String name, String email, Role role, Provider provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
    }
}
