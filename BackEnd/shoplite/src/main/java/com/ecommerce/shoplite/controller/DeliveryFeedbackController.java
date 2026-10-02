package com.ecommerce.shoplite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.DeliveryFeedbackRequest;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.service.OrderService;

@RestController
@RequestMapping("/api/delivery-feedback")
@CrossOrigin(origins = "*")
public class DeliveryFeedbackController {

    @Autowired
    private OrderService orderService;

    // ================= CUSTOMER → ADD FEEDBACK =================
    @PostMapping("/add")
    public ResponseEntity<String> addFeedback(
            Authentication authentication,
            @RequestBody DeliveryFeedbackRequest request) {

        User customer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                orderService.addDeliveryFeedback(
                        customer,
                        request));
    }
}