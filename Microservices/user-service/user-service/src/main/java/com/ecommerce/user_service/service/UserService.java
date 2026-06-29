package com.ecommerce.user_service.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.user_service.dto.RegisterRequest;
import com.ecommerce.user_service.entity.SignupOtp;
import com.ecommerce.user_service.repository.SignupOtpRepository;
import com.ecommerce.user_service.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final SignupOtpRepository signupOtpRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    public UserService(
            UserRepository userRepository,
            SignupOtpRepository signupOtpRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.signupOtpRepository = signupOtpRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ================= SEND SIGNUP OTP =================
    public String sendSignupOtp(RegisterRequest request) {

        System.out.println("STEP 1");

        if (request.getEmail() == null
                || request.getPassword() == null
                || request.getName() == null) {

            throw new RuntimeException("Invalid signup data");
        }

        System.out.println("STEP 2");

        if (userRepository.findByEmail(
                request.getEmail()).isPresent()) {

            throw new RuntimeException("Email already registered");
        }

        System.out.println("STEP 3");

        String otp = String.format(
                "%06d",
                new Random().nextInt(999999));

        SignupOtp signupOtp = signupOtpRepository
                .findByEmail(request.getEmail())
                .orElse(new SignupOtp());

        signupOtp.setEmail(request.getEmail());
        signupOtp.setName(request.getName());

        signupOtp.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        signupOtp.setOtp(otp);

        signupOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        signupOtpRepository.save(signupOtp);

        System.out.println("STEP 4");

        emailService.sendSignupOtp(
                request.getEmail(),
                request.getName(),
                otp);

        System.out.println("STEP 5");

        return "Signup OTP sent successfully";
    }
}