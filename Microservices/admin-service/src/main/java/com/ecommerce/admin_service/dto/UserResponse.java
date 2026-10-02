package com.ecommerce.admin_service.dto;

import com.ecommerce.admin_service.entity.Provider;
import com.ecommerce.admin_service.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;
}
