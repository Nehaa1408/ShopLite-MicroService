package com.ecommerce.shoplite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.LoginRequest;
import com.ecommerce.shoplite.dto.LoginResponse;
import com.ecommerce.shoplite.dto.RegisterRequest;
import com.ecommerce.shoplite.dto.RegisterResponse;
import com.ecommerce.shoplite.service.UserService;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthLocalController {

        @Autowired
        private UserService userService;

        // ================= SEND SIGNUP OTP =================
        @PostMapping("/send-signup-otp")
        public ResponseEntity<String> sendSignupOtp(
                        @Valid @RequestBody RegisterRequest request) {

                return ResponseEntity.ok(
                                userService.sendSignupOtp(request));
        }

        // ================= VERIFY SIGNUP OTP =================
        @PostMapping("/verify-signup-otp")
        public ResponseEntity<RegisterResponse> verifySignupOtp(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(

                                userService.verifySignupOtp(
                                                body.get("email"),
                                                body.get("otp")));
        }

        // ================= REGISTER =================
        @PostMapping("/register")
        public ResponseEntity<RegisterResponse> register(
                        @Valid @RequestBody RegisterRequest request) {

                return ResponseEntity.ok(
                                userService.register(request));
        }

        // ================= LOGIN =================
        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                        @Valid @RequestBody LoginRequest request) {

                return ResponseEntity.ok(

                                userService.login(
                                                request.getEmail(),
                                                request.getPassword()));
        }

        // ================= SEND FORGOT PASSWORD OTP =================
        @PostMapping("/forgot-password/send-otp")
        public ResponseEntity<String> sendForgotPasswordOtp(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(

                                userService.sendForgotPasswordOtp(
                                                body.get("email")));
        }

        // ================= RESET PASSWORD =================
        @PostMapping("/forgot-password/reset")
        public ResponseEntity<String> resetPassword(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(

                                userService.resetPassword(
                                                body.get("email"),
                                                body.get("otp"),
                                                body.get("newPassword")));
        }
}