package com.ecommerce.user_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.user_service.dto.ChangePasswordRequest;
import com.ecommerce.user_service.dto.ProfileResponse;
import com.ecommerce.user_service.dto.ResetPasswordRequest;
import com.ecommerce.user_service.dto.UpdateProfileRequest;
import com.ecommerce.user_service.entity.Role;
import com.ecommerce.user_service.entity.User;
import com.ecommerce.user_service.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get Logged-in User Profile
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                userService.getProfile(user));
    }

    // Update User Profile
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(user, request));
    }

    // Change Password
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(user, request);

        return ResponseEntity.ok("Password changed successfully.");
    }

    // Delete Account
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(
            @AuthenticationPrincipal User user) {

        userService.deleteAccount(user);

        return ResponseEntity.ok("Account deleted successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> sendForgotPasswordOtp(
            @RequestParam String email) {

        return ResponseEntity.ok(
                userService.sendForgotPasswordOtp(email));
    }

    // Verify Forgot Password OTP
    @PostMapping("/verify-forgot-password-otp")
    public ResponseEntity<String> verifyForgotPasswordOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        return ResponseEntity.ok(
                userService.verifyForgotPasswordOtp(email, otp));
    }

    // Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                userService.resetPassword(request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getUserById(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userService.getUserById(userId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/role/{role}")
    public ResponseEntity<List<ProfileResponse>> getUsersByRole(
            @PathVariable Role role) {

        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    @GetMapping("/admin/search/{keyword}")
    public ResponseEntity<List<ProfileResponse>> searchUsers(
            @PathVariable String keyword) {

        return ResponseEntity.ok(userService.searchUsers(keyword));
    }
}
