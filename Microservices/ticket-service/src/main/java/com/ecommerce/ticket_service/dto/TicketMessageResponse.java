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
@AllArgsConstructor
@Builder
public class TicketMessageResponse {

    private Long id;

    private Long ticketId;

    private Long senderId;

    private String sender;

    private String content;

    private LocalDateTime createdAt;
}