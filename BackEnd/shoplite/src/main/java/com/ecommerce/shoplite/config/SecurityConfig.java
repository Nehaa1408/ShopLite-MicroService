package com.ecommerce.shoplite.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.shoplite.security.JwtFilter;

@Configuration
public class SecurityConfig {

        @Autowired
        private JwtFilter jwtFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .cors(cors -> {
                                })

                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // ================= PUBLIC =================
                                                .requestMatchers("/api/auth/**")
                                                .permitAll()

                                                .requestMatchers("/api/delivery/register")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/products/**")
                                                .permitAll()

                                                .requestMatchers("/api/categories/**")
                                                .permitAll()

                                                // ================= ADMIN =================
                                                .requestMatchers("/api/orders/admin/**")
                                                .hasAuthority("ROLE_ADMIN")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/orders/*/status")
                                                .hasAuthority("ROLE_ADMIN")

                                                // DELIVERY APPROVAL
                                                .requestMatchers("/api/delivery/approve/**")
                                                .hasAuthority("ROLE_ADMIN")

                                                // DELIVERY ADMIN APIs
                                                .requestMatchers("/api/delivery/all")
                                                .hasAuthority("ROLE_ADMIN")

                                                .requestMatchers("/api/delivery/pending")
                                                .hasAuthority("ROLE_ADMIN")

                                                .requestMatchers("/api/delivery/reject/**")
                                                .hasAuthority("ROLE_ADMIN")

                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/delivery/*")
                                                .hasAuthority("ROLE_ADMIN")

                                                // ================= DELIVERY =================
                                                .requestMatchers("/api/orders/delivery/**")
                                                .hasAuthority("ROLE_DELIVERY")

                                                .requestMatchers("/api/delivery/profile")
                                                .hasAuthority("ROLE_DELIVERY")

                                                .requestMatchers("/api/delivery/profile/update")
                                                .hasAuthority("ROLE_DELIVERY")

                                                // ================= USER =================
                                                .requestMatchers("/api/cart/**")
                                                .authenticated()

                                                .requestMatchers("/api/orders/**")
                                                .authenticated()

                                                .requestMatchers("/api/tickets/**")
                                                .authenticated()

                                                .requestMatchers("/api/users/**")
                                                .authenticated()

                                                // PROFILE
                                                .requestMatchers("/api/user/**")
                                                .authenticated()

                                                // ================= ANY =================
                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

                org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

                config.setAllowedOrigins(
                                java.util.List.of("http://localhost:5173"));

                config.setAllowedMethods(
                                java.util.List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "OPTIONS"));

                config.setAllowedHeaders(
                                java.util.List.of("*"));

                config.setAllowCredentials(true);

                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }

        @Bean
        public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {

                return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        }
}