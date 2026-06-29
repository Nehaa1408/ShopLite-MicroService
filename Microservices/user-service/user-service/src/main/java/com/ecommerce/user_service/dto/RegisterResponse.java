package com.ecommerce.user_service.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;
}
