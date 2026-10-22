package com.ecommerce.order_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "delivery_feedback")
@Getter
@Setter
@NoArgsConstructor
public class DeliveryFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "delivery_partner_id")
    private Long deliveryPartnerId;

    @Column(nullable = false)
    private int rating;

    @Column(length = 1000)
    private String feedback;

    public DeliveryFeedback(Long id, Long orderId, Long customerId, Long deliveryPartnerId, int rating, String feedback) {
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.deliveryPartnerId = deliveryPartnerId;
        this.rating = rating;
        this.feedback = feedback;
    }
}