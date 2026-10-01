package com.ecommerce.ticket_service.service;

import java.util.List;

import com.ecommerce.ticket_service.dto.AdminResponseRequest;
import com.ecommerce.ticket_service.dto.CreateTicketRequest;
import com.ecommerce.ticket_service.dto.TicketResponse;
import com.ecommerce.ticket_service.dto.UpdateTicketRequest;
import com.ecommerce.ticket_service.dto.UpdateTicketStatusRequest;

public interface TicketService {

    // Customer
    TicketResponse createTicket(Long userId, CreateTicketRequest request);

    List<TicketResponse> getMyTickets(Long userId);

    TicketResponse getMyTicketById(Long userId, Long ticketId);

    TicketResponse updateMyTicket(
            Long userId,
            Long ticketId,
            UpdateTicketRequest request
    );

    // Admin
    List<TicketResponse> getAllTickets();

    TicketResponse updateTicketStatus(
            Long ticketId,
            UpdateTicketStatusRequest request
    );

    TicketResponse addAdminResponse(
            Long ticketId,
            AdminResponseRequest request
    );
}