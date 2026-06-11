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
                System.out.println("PATH : " + request.getRequestURI());
System.out.println("AUTH HEADER : " + request.getHeader("Authorization"));

                // ================= PUBLIC ENDPOINTS =================
                if (path.startsWith("/api/auth")
                                || path.startsWith("/api/categories")
                                || path.startsWith("/api/delivery/register")
                                || path.startsWith("/api/upload")) {

                        filterChain.doFilter(request, response);
                        return;
                }
                // ================= GET TOKEN =================
                String authHeader = request.getHeader("Authorization");

                // NO TOKEN
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {

                        filterChain.doFilter(request, response);
                        return;
                }

                String token = authHeader.substring(7);

                try {

                        // ================= EXTRACT EMAIL =================
                        String email = jwtUtil.extractEmail(token);
                        System.out.println("JWT TOKEN : " + token);
                        System.out.println("JWT EMAIL : " + email);

                        // ================= AUTHENTICATE =================
                        if (email != null
                                        && SecurityContextHolder
                                                        .getContext()
                                                        .getAuthentication() == null) {

                                User user = userRepository.findByEmail(email)
                                                .orElseThrow(() -> new RuntimeException("User not found"));

                                // ROLE
                                String role = "ROLE_" + user.getRole().name();

                                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                                user,
                                                token,
                                                authorities);

                                authToken.setDetails(

                                                new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()

                                                                .buildDetails(request));

                                SecurityContextHolder
                                                .getContext()
                                                .setAuthentication(authToken);
                        }

                } catch (Exception e) {

                        System.out.println("JWT ERROR: " + e.getMessage());

                        SecurityContextHolder.clearContext();
                }

                filterChain.doFilter(request, response);
        }
}