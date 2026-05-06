package com.ecommerce.shoplite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.LoginRequest;
import com.ecommerce.shoplite.dto.LoginResponse;
import com.ecommerce.shoplite.dto.RegisterRequest;
import com.ecommerce.shoplite.dto.RegisterResponse;
import com.ecommerce.shoplite.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthLocalController {

    @Autowired
    private UserService userService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                userService.register(request)
        );
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(

                userService.login(
                        request.getEmail(),
                        request.getPassword()
                )
        );
    }
}