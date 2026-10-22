package com.ecommerce.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class TicketMessageResponse {

    private Long id;

    private Long ticketId;

    private Long senderId;

    private String sender;

    private String content;

    private LocalDateTime createdAt;

    public TicketMessageResponse(Long id, Long ticketId, Long senderId, String sender, String content, LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.senderId = senderId;
        this.sender = sender;
        this.content = content;
        this.createdAt = createdAt;
    }
}