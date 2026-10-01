package com.ecommerce.ticket_service.dto;

import java.time.LocalDateTime;

import com.ecommerce.ticket_service.enums.TicketCategory;
import com.ecommerce.ticket_service.enums.TicketPriority;
import com.ecommerce.ticket_service.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {

    private Long ticketId;

    private Long userId;

    private Long orderId;

    private String subject;

    private String description;

    private TicketCategory category;

    private TicketPriority priority;

    private TicketStatus status;

    private String adminResponse;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
