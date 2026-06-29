package com.ecommerce.user_service.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private Provider provider;

    private String token;

    public LoginResponse(
            Long id,
            String name,
            String email,
            Role role,
            Provider provider,
            String token) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}