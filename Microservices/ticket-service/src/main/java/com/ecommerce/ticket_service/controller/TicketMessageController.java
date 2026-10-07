package com.ecommerce.ticket_service.controller;

import com.ecommerce.ticket_service.dto.TicketMessageResponse;
import com.ecommerce.ticket_service.service.TicketMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketMessageController {

    private final TicketMessageService ticketMessageService;

    public TicketMessageController(
            TicketMessageService ticketMessageService) {
        this.ticketMessageService = ticketMessageService;
    }

    // Get messages for a ticket
    @GetMapping("/{ticketId}/messages")
    public ResponseEntity<List<TicketMessageResponse>> getMessages(
            @PathVariable Long ticketId) {

        return ResponseEntity.ok(
                ticketMessageService.getMessages(ticketId));
    }

    // Add a message to a ticket
    @PostMapping("/{ticketId}/messages")
    public ResponseEntity<TicketMessageResponse> addMessage(
            @PathVariable Long ticketId,
            @RequestParam String content,
            @RequestHeader("X-User-Id") Long senderId,
            @RequestHeader("X-User-Role") String sender) {

        return ResponseEntity.ok(
                ticketMessageService.addMessage(
                        ticketId,
                        senderId,
                        sender,
                        content));
    }
}