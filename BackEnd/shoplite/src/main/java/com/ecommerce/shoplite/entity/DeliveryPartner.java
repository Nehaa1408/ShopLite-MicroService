package com.ecommerce.shoplite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "delivery_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // LINKED USER ACCOUNT
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({
            "password"
    })
    private User user;

    // PHONE NUMBER
    @Column(length = 20)
    private String phone;

    // PROFILE IMAGE
    private String profileImage;

    // VEHICLE TYPE
    @Column(length = 50)
    private String vehicleType;

    // VEHICLE NUMBER
    @Column(length = 30)
    private String vehicleNumber;

    // LICENSE NUMBER
    @Column(length = 50)
    private String licenseNumber;

    // AADHAAR NUMBER
    @Column(length = 20)
    private String aadhaarNumber;

    // DOCUMENT IMAGE
    private String documentImage;

    // CURRENTLY AVAILABLE?
    private boolean active = true;

    // ADMIN APPROVAL
    private boolean approved = false;
    private boolean rejected = false;
    // RATING
    private double rating = 5.0;

    // TOTAL COMPLETED DELIVERIES
    private int completedDeliveries = 0;

    // JOIN DATE
    private LocalDate joinedDate;

    // AUTO DATE
    @PrePersist
    protected void onCreate() {

        this.joinedDate = LocalDate.now();
    }
}