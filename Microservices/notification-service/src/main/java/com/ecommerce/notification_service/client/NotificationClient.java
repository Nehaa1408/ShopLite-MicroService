package com.ecommerce.notification_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {

        @PostMapping("/api/notifications/signup-otp")
        void sendSignupOtp(
                        @RequestParam String email,
                        @RequestParam String name,
                        @RequestParam String otp);

        @PostMapping("/api/notifications/forgot-password-otp")
        void sendForgotPasswordOtp(
                        @RequestParam String email,
                        @RequestParam String otp);

        @PostMapping("/api/notifications/login-success")
        void sendLoginSuccessEmail(
                        @RequestParam("email") String email,
                        @RequestParam("name") String name);
}