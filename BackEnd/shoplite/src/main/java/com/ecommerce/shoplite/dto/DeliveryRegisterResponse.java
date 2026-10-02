package com.ecommerce.shoplite.dto;

import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeliveryRegisterResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private Provider provider;

    private String token;

    private String message;

    private boolean approved;
}