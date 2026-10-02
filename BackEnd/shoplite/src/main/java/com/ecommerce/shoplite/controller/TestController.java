package com.ecommerce.shoplite.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test-secure")
    public String testSecure() {
        return "This is a protected API";
    }
}