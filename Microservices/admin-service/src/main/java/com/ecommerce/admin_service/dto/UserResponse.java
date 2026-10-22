package com.ecommerce.admin_service.dto;

import com.ecommerce.admin_service.entity.Provider;
import com.ecommerce.admin_service.entity.Role;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;

    public UserResponse(Long id, String name, String email, Role role, Provider provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
    }
}
