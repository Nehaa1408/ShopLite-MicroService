package com.ecommerce.shoplite.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.UserRepository;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip auth endpoints
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null) {

                        String role = user.getRole().name();

                        if (!role.startsWith("ROLE_")) {
                            role = "ROLE_" + role;
                        }

                        List<SimpleGrantedAuthority> authorities = List.of(
                                new SimpleGrantedAuthority(role));

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                authorities);

                        authToken.setDetails(
                                new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                                        .buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }

            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}