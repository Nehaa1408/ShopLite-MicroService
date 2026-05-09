package com.ecommerce.shoplite.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // NAME
    @Column(nullable = false, length = 150)
    private String name;

    // DESCRIPTION
    @Column(nullable = false, length = 1000)
    private String description;

    // PRICE
    @Column(nullable = false)
    private double price;

    // QUANTITY
    @Column(nullable = false)
    private int quantity;

    // IMAGE URL
    @Column(nullable = false, length = 1000)
    private String imageUrl;

    // CATEGORY
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")

    
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    // BRAND
    @Column(length = 100)
    private String brand;

    // TYPE (HOME / BRAND)
    @Column(length = 50)
    private String type;

    // SOFT DELETE
    @Column(nullable = false)
    private boolean active = true;
}