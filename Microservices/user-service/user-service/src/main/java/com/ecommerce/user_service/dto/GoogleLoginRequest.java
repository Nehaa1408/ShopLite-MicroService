package com.ecommerce.user_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class GoogleLoginRequest {
    private String token;
}