package com.ecommerce.order_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ORDER LINK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // PRODUCT SERVICE REFERENCE
    @Column(name = "product_id", nullable = false)
    private Long productId;

    // PRODUCT SNAPSHOT
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double subtotal;

    @Column(name = "product_image", columnDefinition = "TEXT")
    private String productImage;

    public OrderItem(Long id, Order order, Long productId, String productName,
                     double price, int quantity, double subtotal, String productImage) {
        this.id = id;
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.productImage = productImage;
    }
}