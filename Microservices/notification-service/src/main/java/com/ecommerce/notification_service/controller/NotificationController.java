package com.ecommerce.notification_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.notification_service.dto.DeliveryOtpNotificationRequest;
import com.ecommerce.notification_service.dto.OrderPlacedNotificationRequest;
import com.ecommerce.notification_service.dto.OrderStatusNotificationRequest;
import com.ecommerce.notification_service.dto.PaymentNotificationRequest;
import com.ecommerce.notification_service.service.EmailService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/signup-otp")
    public String sendSignupOtp(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String otp) {

        emailService.sendSignupOtp(email, name, otp);

        return "Signup OTP email sent successfully";
    }

    @PostMapping("/forgot-password-otp")
    public String sendForgotPasswordOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        emailService.sendForgotPasswordOtp(email, otp);

        return "Forgot password OTP email sent successfully";
    }

    @PostMapping("/password-reset-success")
    public ResponseEntity<String> sendPasswordResetSuccessEmail(
            @RequestParam String email,
            @RequestParam String name) {

        emailService.sendPasswordResetSuccessEmail(email, name);

        return ResponseEntity.ok(
                "Password reset confirmation email sent successfully");
    }

    @PostMapping("/login-success")
    public ResponseEntity<String> sendLoginSuccessEmail(
            @RequestParam String email,
            @RequestParam String name) {

        emailService.sendLoginSuccessEmail(email, name);

        return ResponseEntity.ok(
                "Login notification email sent successfully");
    }

    @PostMapping("/order-placed")
    public ResponseEntity<String> sendOrderPlacedEmail(
            @RequestBody OrderPlacedNotificationRequest request) {

        emailService.sendOrderPlacedEmail(request);

        return ResponseEntity.ok(
                "Order placed notification email sent successfully");
    }

    @PostMapping("/payment")
    public ResponseEntity<String> sendPaymentNotification(
            @RequestBody PaymentNotificationRequest request) {

        emailService.sendPaymentNotificationEmail(request);

        return ResponseEntity.ok(
                "Payment notification email sent successfully");
    }
    // ================= ORDER STATUS NOTIFICATION =================

    @PostMapping("/order-status")
    public ResponseEntity<String> sendOrderStatusNotification(
            @RequestBody OrderStatusNotificationRequest request) {

        emailService.sendOrderStatusNotificationEmail(request);

        return ResponseEntity.ok(
                "Order status notification email sent successfully");
    }
    // ================= DELIVERY OTP =================

    @PostMapping("/delivery-otp")
    public ResponseEntity<String> sendDeliveryOtp(
            @RequestBody DeliveryOtpNotificationRequest request) {

        emailService.sendDeliveryOtpEmail(request);

        return ResponseEntity.ok("Delivery OTP email sent successfully");
    }
}