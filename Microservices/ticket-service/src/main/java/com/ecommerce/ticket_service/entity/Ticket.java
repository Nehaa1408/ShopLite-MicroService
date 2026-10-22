package com.ecommerce.ticket_service.entity;

import java.time.LocalDateTime;

import com.ecommerce.ticket_service.enums.TicketCategory;
import com.ecommerce.ticket_service.enums.TicketPriority;
import com.ecommerce.ticket_service.enums.TicketStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import lombok.Builder;
import lombok.Getter;

import lombok.Setter;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@Builder
public class Ticket {

    public Ticket() {
    }

    public Ticket(Long ticketId, Long userId, Long orderId, String subject, String description,
                  TicketCategory category, TicketPriority priority, TicketStatus status,
                  String adminResponse, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.orderId = orderId;
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.adminResponse = adminResponse;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long ticketId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = TicketStatus.OPEN;
        }

        if (priority == null) {
            priority = TicketPriority.MEDIUM;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}