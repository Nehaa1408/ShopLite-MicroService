package com.ecommerce.user_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // NAME
    @Column(nullable = false, length = 100)
    private String name;

    // EMAIL
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // PASSWORD (SECURE)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 255)
    private String password;

    // ROLE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // PROVIDER
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;
}