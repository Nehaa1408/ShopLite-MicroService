package com.ecommerce.shoplite.dto;

import com.ecommerce.shoplite.entity.Provider;
import com.ecommerce.shoplite.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String email;

    private String password;

    private Role role;

    private Provider provider;
}