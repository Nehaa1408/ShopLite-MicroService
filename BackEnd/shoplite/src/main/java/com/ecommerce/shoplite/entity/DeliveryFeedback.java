package com.ecommerce.shoplite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ORDER
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // CUSTOMER
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    // DELIVERY PARTNER
    @ManyToOne
    @JoinColumn(name = "delivery_partner_id")
    private User deliveryPartner;

    // RATING
    private Integer rating;

    // FEEDBACK
    @Column(length = 1000)
    private String feedback;

    // CREATED TIME
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}