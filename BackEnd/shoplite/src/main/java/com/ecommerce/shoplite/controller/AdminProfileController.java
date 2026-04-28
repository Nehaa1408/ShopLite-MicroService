package com.ecommerce.shoplite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminProfileController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public User getAdminProfile(@RequestHeader("Authorization") String token) {

        token = token.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}