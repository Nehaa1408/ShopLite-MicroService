package com.ecommerce.ticket_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_messages")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class TicketMessage {

    public TicketMessage(Long id, Long ticketId, Long senderId, String sender, String content, LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.senderId = senderId;
        this.sender = sender;
        this.content = content;
        this.createdAt = createdAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ticketId;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false, length = 20)
    private String sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}