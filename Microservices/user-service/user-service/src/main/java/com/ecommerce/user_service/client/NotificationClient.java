package com.ecommerce.user_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {

        @PostMapping("/api/notifications/signup-otp")
        void sendSignupOtp(
                        @RequestParam("email") String email,
                        @RequestParam("name") String name,
                        @RequestParam("otp") String otp);

        @PostMapping("/api/notifications/forgot-password-otp")
        void sendForgotPasswordOtp(
                        @RequestParam("email") String email,
                        @RequestParam("otp") String otp);

        @PostMapping("/api/notifications/password-reset-success")
        void sendPasswordResetSuccessEmail(
                        @RequestParam("email") String email,
                        @RequestParam("name") String name);

        @PostMapping("/api/notifications/login-success")
        void sendLoginSuccessEmail(
                        @RequestParam("email") String email,
                        @RequestParam("name") String name);
}