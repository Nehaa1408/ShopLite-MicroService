package com.ecommerce.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.user_service.dto.RegisterRequest;
import com.ecommerce.user_service.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/test-otp")
    public String testOtp() {
        return "OTP ENDPOINT REACHED";
    }

    @PostMapping("/send-signup-otp")
    public ResponseEntity<String> sendSignupOtp(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                userService.sendSignupOtp(request));
    }
}