package com.ecommerce.shoplite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.*;
import com.ecommerce.shoplite.entity.*;
import com.ecommerce.shoplite.repository.DeliveryPartnerRepository;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;

import java.util.Collections;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= REGISTER =================
    public RegisterResponse register(RegisterRequest request) {

        if (request.getEmail() == null
                || request.getPassword() == null) {

            throw new RuntimeException("Invalid input");
        }

        if (userRepository.findByEmail(
                request.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already registered");
        }

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        user.setRole(Role.USER);

        user.setProvider(Provider.LOCAL);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getProvider()
        );
    }

    // ================= LOGIN =================
    public LoginResponse login(
            String email,
            String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // GOOGLE ACCOUNT CHECK
        if (user.getProvider() == Provider.GOOGLE) {

            throw new RuntimeException(
                    "Use Google login for this account");
        }

        String storedPassword = user.getPassword();

        if (storedPassword == null) {

            throw new RuntimeException(
                    "Use Google login for this account");
        }

        // PASSWORD CHECK
        if (storedPassword.startsWith("$2a$")) {

            if (!passwordEncoder.matches(
                    password,
                    storedPassword)) {

                throw new RuntimeException(
                        "Invalid password");
            }

        } else {

            if (!storedPassword.equals(password)) {

                throw new RuntimeException(
                        "Invalid password");
            }
        }

        // ================= DELIVERY APPROVAL =================
        if (user.getRole() == Role.DELIVERY) {

            DeliveryPartner partner =
                    deliveryPartnerRepository.findByUser(user)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Delivery profile not found"));

            // NOT APPROVED
            if (!partner.isApproved()) {

                throw new RuntimeException(
                        "Your delivery account is waiting for admin approval");
            }

            // INACTIVE
            if (!partner.isActive()) {

                throw new RuntimeException(
                        "Your delivery account is inactive");
            }
        }

        // GENERATE TOKEN
        String token =
                jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProvider(),
                token
        );
    }

    // ================= GOOGLE LOGIN =================
    public LoginResponse googleLogin(String token) {

        try {

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(

                            new NetHttpTransport(),

                            GsonFactory.getDefaultInstance())

                            .setAudience(Collections.singletonList(
                                    "646428028394-gp3mhtk8tvb45rov640k2d11m6qsfpcc.apps.googleusercontent.com"))

                            .build();

            GoogleIdToken idToken =
                    verifier.verify(token);

            if (idToken == null) {

                throw new RuntimeException(
                        "Invalid Google token");
            }

            GoogleIdToken.Payload payload =
                    idToken.getPayload();

            if (!Boolean.TRUE.equals(
                    payload.getEmailVerified())) {

                throw new RuntimeException(
                        "Email not verified");
            }

            String email = payload.getEmail();

            String name =
                    (String) payload.get("name");

            User user =
                    userRepository.findByEmail(email)
                            .orElse(null);

            if (user == null) {

                user = new User();

                user.setEmail(email);

                user.setName(name);

                user.setPassword(null);

                user.setRole(Role.USER);

                user.setProvider(Provider.GOOGLE);

                user = userRepository.save(user);

            } else {

                if (user.getProvider()
                        == Provider.LOCAL) {

                    throw new RuntimeException(
                            "Use email/password login for this account");
                }
            }

            String jwt =
                    jwtUtil.generateToken(user.getEmail());

            return new LoginResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getProvider(),
                    jwt
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Google authentication failed: "
                            + e.getMessage());
        }
    }
}