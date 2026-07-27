package com.ecommerce.user_service.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.user_service.dto.GoogleLoginRequest;
import com.ecommerce.user_service.dto.LoginRequest;
import com.ecommerce.user_service.dto.LoginResponse;
import com.ecommerce.user_service.dto.RegisterRequest;
import com.ecommerce.user_service.dto.RegisterResponse;
import com.ecommerce.user_service.dto.ResetPasswordRequest;
import com.ecommerce.user_service.service.UserService;

import jakarta.validation.Valid;

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

        @PostMapping("/verify-signup-otp")
        public ResponseEntity<RegisterResponse> verifySignupOtp(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(
                                userService.verifySignupOtp(
                                                body.get("email"),
                                                body.get("otp")));
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                        @Valid @RequestBody LoginRequest request) {

                return ResponseEntity.ok(
                                userService.login(request));
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<String> forgotPassword(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(
                                userService.sendForgotPasswordOtp(
                                                body.get("email")));
        }

        @PostMapping("/verify-forgot-password-otp")
        public ResponseEntity<String> verifyForgotPasswordOtp(
                        @RequestBody Map<String, String> body) {

                return ResponseEntity.ok(
                                userService.verifyForgotPasswordOtp(
                                                body.get("email"),
                                                body.get("otp")));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<String> resetPassword(
                        @RequestBody ResetPasswordRequest request) {

                return ResponseEntity.ok(
                                userService.resetPassword(request));
        }

        @PostMapping("/google")
        public ResponseEntity<LoginResponse> googleLogin(
                        @RequestBody GoogleLoginRequest request) {

                return ResponseEntity.ok(
                                userService.googleLogin(request.getToken()));
        }
}