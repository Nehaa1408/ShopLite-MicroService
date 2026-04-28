package com.ecommerce.shoplite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.dto.LoginResponse;
import com.ecommerce.shoplite.dto.RegisterResponse;
import com.ecommerce.shoplite.entity.Provider;
import com.ecommerce.shoplite.entity.Role;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;

import java.util.Collections;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public RegisterResponse register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        if (user.getProvider() == null) {
            user.setProvider(Provider.LOCAL);
        }

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getProvider());
    }

    public LoginResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Admin only");
        }
        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProvider(),
                token);
    }

    public LoginResponse googleLogin(String token) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(
                            "646428028394-gp3mhtk8tvb45rov640k2d11m6qsfpcc.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new RuntimeException("Email not verified by Google");
            }

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {

                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPassword("");
                user.setRole(Role.USER);
                user.setProvider(Provider.GOOGLE);

                user = userRepository.save(user);

            } else {

                if (user.getProvider() == Provider.LOCAL) {
                    throw new RuntimeException(
                            "This email is registered with password. Use normal login.");
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

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    public User getProfile(String token) {

        token = token.substring(7); // remove "Bearer "

        String email = jwtUtil.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
