package com.ecommerce.user_service.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.user_service.dto.ChangePasswordRequest;
import com.ecommerce.user_service.dto.LoginRequest;
import com.ecommerce.user_service.dto.LoginResponse;
import com.ecommerce.user_service.dto.ProfileResponse;
import com.ecommerce.user_service.dto.RegisterRequest;
import com.ecommerce.user_service.dto.RegisterResponse;
import com.ecommerce.user_service.dto.ResetPasswordRequest;
import com.ecommerce.user_service.dto.UpdateProfileRequest;
import com.ecommerce.user_service.entity.ForgotPasswordOtp;
import com.ecommerce.user_service.entity.Provider;
import com.ecommerce.user_service.entity.Role;
import com.ecommerce.user_service.entity.SignupOtp;
import com.ecommerce.user_service.entity.User;
import com.ecommerce.user_service.exception.EmailAlreadyExistsException;
import com.ecommerce.user_service.exception.InvalidOtpException;
import com.ecommerce.user_service.exception.InvalidPasswordException;
import com.ecommerce.user_service.exception.UserNotFoundException;
import com.ecommerce.user_service.repository.ForgotPasswordOtpRepository;
import com.ecommerce.user_service.repository.SignupOtpRepository;
import com.ecommerce.user_service.repository.UserRepository;
import com.ecommerce.user_service.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class UserService {

        private final UserRepository userRepository;

        private final SignupOtpRepository signupOtpRepository;

        private final PasswordEncoder passwordEncoder;

        private final EmailService emailService;

        private final ForgotPasswordOtpRepository forgotPasswordOtpRepository;

        private final JwtUtil jwtUtil;

        @Value("${google.client-id}")
        private String googleClientId;

        public UserService(
                        UserRepository userRepository,
                        SignupOtpRepository signupOtpRepository,
                        PasswordEncoder passwordEncoder,
                        EmailService emailService,
                        ForgotPasswordOtpRepository forgotPasswordOtpRepository,
                        JwtUtil jwtUtil) {

                this.userRepository = userRepository;
                this.signupOtpRepository = signupOtpRepository;
                this.passwordEncoder = passwordEncoder;
                this.emailService = emailService;
                this.forgotPasswordOtpRepository = forgotPasswordOtpRepository;
                this.jwtUtil = jwtUtil;
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

                        throw new EmailAlreadyExistsException("Email already exists");
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

        // ================= VERIFY SIGNUP OTP =================
        public RegisterResponse verifySignupOtp(
                        String email,
                        String otp) {

                System.out.println("EMAIL = " + email);
                System.out.println("OTP = " + otp);
                System.out.println("VERIFY STEP 1");

                SignupOtp signupOtp = signupOtpRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "OTP request not found"));

                System.out.println("DB OTP = " + signupOtp.getOtp());
                System.out.println("DB EXPIRY = " + signupOtp.getExpiryTime());
                System.out.println("NOW = " + LocalDateTime.now());

                // OTP CHECK
                if (!signupOtp.getOtp().equals(otp)) {

                        throw new InvalidOtpException("Invalid OTP");
                }

                // EXPIRY CHECK
                if (signupOtp.getExpiryTime()
                                .isBefore(LocalDateTime.now())) {

                        throw new IllegalArgumentException("OTP expired");
                }

                // DOUBLE CHECK EMAIL
                if (userRepository.findByEmail(email)
                                .isPresent()) {

                        throw new RuntimeException(
                                        "Email already registered");
                }

                // CREATE USER
                User user = new User();

                user.setName(signupOtp.getName());

                user.setEmail(signupOtp.getEmail());

                user.setPassword(signupOtp.getPassword());

                user.setRole(Role.USER);

                user.setProvider(Provider.LOCAL);

                User savedUser = userRepository.save(user);

                // DELETE TEMP OTP
                signupOtpRepository.delete(signupOtp);

                return new RegisterResponse(
                                savedUser.getId(),
                                savedUser.getName(),
                                savedUser.getEmail(),
                                savedUser.getRole(),
                                savedUser.getProvider());
        }

        // ================= LOGIN =================
        public LoginResponse login(LoginRequest request) {

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                // GOOGLE ACCOUNT CHECK
                if (user.getProvider() == Provider.GOOGLE) {
                        throw new RuntimeException("Use Google login for this account");
                }

                String storedPassword = user.getPassword();

                if (storedPassword == null) {
                        throw new RuntimeException("Use Google login for this account");
                }

                // PASSWORD CHECK
                if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
                        throw new RuntimeException("Invalid password");
                }

                // GENERATE JWT TOKEN
                String token = jwtUtil.generateToken(user.getEmail());

                return new LoginResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getProvider(),
                                token);
        }

        // ================= SEND FORGOT PASSWORD OTP =================
        public String sendForgotPasswordOtp(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Email not registered"));

                // GOOGLE ACCOUNT CHECK
                if (user.getProvider() == Provider.GOOGLE) {
                        throw new RuntimeException("This account uses Google login");
                }

                // GENERATE OTP
                String otp = String.format("%06d", new Random().nextInt(999999));

                ForgotPasswordOtp forgotOtp = forgotPasswordOtpRepository
                                .findByEmail(email)
                                .orElse(new ForgotPasswordOtp());

                forgotOtp.setEmail(email);
                forgotOtp.setOtp(otp);
                forgotOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

                forgotPasswordOtpRepository.save(forgotOtp);

                emailService.sendForgotPasswordOtp(email, otp);

                return "Password reset OTP sent successfully";
        }

        // ================= VERIFY FORGOT PASSWORD OTP =================
        public String verifyForgotPasswordOtp(String email, String otp) {

                ForgotPasswordOtp forgotOtp = forgotPasswordOtpRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("OTP request not found"));

                // OTP CHECK
                if (!forgotOtp.getOtp().equals(otp)) {
                        throw new RuntimeException("Invalid OTP");
                }

                // EXPIRY CHECK
                if (forgotOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP expired");
                }

                return "OTP verified successfully";
        }

        // ================= RESET PASSWORD =================
        public String resetPassword(ResetPasswordRequest request) {

                ForgotPasswordOtp forgotOtp = forgotPasswordOtpRepository
                                .findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("OTP request not found"));

                // OTP CHECK
                if (!forgotOtp.getOtp().equals(request.getOtp())) {
                        throw new RuntimeException("Invalid OTP");
                }

                // EXPIRY CHECK
                if (forgotOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP expired");
                }

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));

                userRepository.save(user);

                // DELETE OTP AFTER SUCCESSFUL RESET
                forgotPasswordOtpRepository.delete(forgotOtp);

                return "Password reset successful";
        }

        // ================= GOOGLE LOGIN =================
        public LoginResponse googleLogin(String token) {

                try {

                        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                                        new NetHttpTransport(),
                                        GsonFactory.getDefaultInstance())
                                        .setAudience(Collections.singletonList(googleClientId))
                                        .build();

                        GoogleIdToken idToken = verifier.verify(token);

                        if (idToken == null) {
                                throw new RuntimeException("Invalid Google token");
                        }

                        GoogleIdToken.Payload payload = idToken.getPayload();

                        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                                throw new RuntimeException("Email not verified");
                        }

                        String email = payload.getEmail();
                        String name = (String) payload.get("name");

                        User user = userRepository.findByEmail(email).orElse(null);

                        if (user == null) {

                                user = new User();

                                user.setEmail(email);
                                user.setName(name);
                                user.setPassword(
                                                passwordEncoder.encode(UUID.randomUUID().toString()));
                                user.setRole(Role.USER);
                                user.setProvider(Provider.GOOGLE);

                                user = userRepository.save(user);

                        } else {

                                if (user.getProvider() == Provider.LOCAL) {
                                        throw new RuntimeException(
                                                        "Use email/password login for this account");
                                }
                        }

                        String jwt = jwtUtil.generateToken(user.getEmail());

                        return new LoginResponse(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail(),
                                        user.getRole(),
                                        user.getProvider(),
                                        jwt);

                } catch (IOException | RuntimeException | GeneralSecurityException e) {

                        throw new RuntimeException(e.getMessage());
                }
        }

        public ProfileResponse getProfile(User user) {

                return new ProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getProvider());
        }

        public ProfileResponse updateProfile(
                        User user,
                        UpdateProfileRequest request) {

                user.setName(request.getName());

                User updatedUser = userRepository.save(user);

                return new ProfileResponse(
                                updatedUser.getId(),
                                updatedUser.getName(),
                                updatedUser.getEmail(),
                                updatedUser.getRole(),
                                updatedUser.getProvider());
        }

        public void changePassword(
                        User user,
                        ChangePasswordRequest request) {

                // Verify current password
                if (!passwordEncoder.matches(
                                request.getCurrentPassword(),
                                user.getPassword())) {

                        throw new InvalidPasswordException("Current password is incorrect");
                }

                // Update password
                user.setPassword(
                                passwordEncoder.encode(request.getNewPassword()));

                userRepository.save(user);
        }

        public void deleteAccount(User user) {

                userRepository.delete(user);
        }
}