package com.ecommerce.ticket_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.ticket_service.dto.AdminResponseRequest;
import com.ecommerce.ticket_service.dto.CreateTicketRequest;
import com.ecommerce.ticket_service.dto.TicketResponse;
import com.ecommerce.ticket_service.dto.UpdateTicketRequest;
import com.ecommerce.ticket_service.dto.UpdateTicketStatusRequest;
import com.ecommerce.ticket_service.entity.Ticket;
import com.ecommerce.ticket_service.repository.TicketRepository;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // =========================
    // CUSTOMER OPERATIONS
    // =========================
    @Override
    public TicketResponse createTicket(
            Long userId,
            CreateTicketRequest request) {

        Ticket ticket = Ticket.builder()
                .userId(userId)
                .orderId(request.getOrderId())
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        return mapToResponse(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(Long userId) {

        return ticketRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getMyTicketById(
            Long userId,
            Long ticketId) {

        Ticket ticket = findTicket(ticketId);

        verifyTicketOwner(ticket, userId);

        return mapToResponse(ticket);
    }

    @Override
    public TicketResponse updateMyTicket(
            Long userId,
            Long ticketId,
            UpdateTicketRequest request) {

        Ticket ticket = findTicket(ticketId);

        verifyTicketOwner(ticket, userId);

        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());

        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }

    // =========================
    // ADMIN OPERATIONS
    // =========================

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long ticketId) {

        Ticket ticket = findTicket(ticketId);

        return mapToResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {

        return ticketRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getTicketCount() {

        return ticketRepository.count();
    }

    @Override
    public TicketResponse updateTicketStatus(
            Long ticketId,
            UpdateTicketStatusRequest request) {

        Ticket ticket = findTicket(ticketId);

        ticket.setStatus(request.getStatus());

        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }

    @Override
    public TicketResponse addAdminResponse(
            Long ticketId,
            AdminResponseRequest request) {

        Ticket ticket = findTicket(ticketId);

        ticket.setAdminResponse(request.getResponse());

        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }

    // =========================
    // HELPER METHODS
    // =========================
    private Ticket findTicket(Long ticketId) {

        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException(
                        "Ticket not found with id: " + ticketId));
    }

    private void verifyTicketOwner(
            Ticket ticket,
            Long userId) {

        if (!ticket.getUserId().equals(userId)) {
            throw new RuntimeException(
                    "You are not authorized to access this ticket");
        }
    }

    private TicketResponse mapToResponse(Ticket ticket) {

        return TicketResponse.builder()
                .ticketId(ticket.getTicketId())
                .userId(ticket.getUserId())
                .orderId(ticket.getOrderId())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .adminResponse(ticket.getAdminResponse())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
