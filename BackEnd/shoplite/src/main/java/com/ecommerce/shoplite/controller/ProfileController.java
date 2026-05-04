package com.ecommerce.shoplite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.entity.User;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(user);
    }
}