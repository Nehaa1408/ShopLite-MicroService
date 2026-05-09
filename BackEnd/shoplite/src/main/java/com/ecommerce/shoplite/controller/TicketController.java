package com.ecommerce.shoplite.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.dto.MessageResponse;
import com.ecommerce.shoplite.dto.TicketResponse;
import com.ecommerce.shoplite.entity.Message;
import com.ecommerce.shoplite.entity.Ticket;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.MessageRepository;
import com.ecommerce.shoplite.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private MessageRepository messageRepository;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ticketService.createTicket(
                        user,
                        body.get("subject"),
                        body.get("message")));
    }

    // ================= USER =================
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getUserTickets(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<TicketResponse> result = ticketService.getUserTickets(user)
                .stream()
                .map(this::mapToDTO)
                .toList();

        return ResponseEntity.ok(result);
    }

    // ================= ADMIN =================
    @GetMapping("/admin")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(
                ticketService.getAllTickets()
                        .stream()
                        .map(this::mapToDTO)
                        .toList());
    }

    // ================= UPDATE STATUS =====================
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        if (body == null || body.get("status") == null) {
            throw new RuntimeException("Status is missing");
        }

        String status = body.get("status");

        return ResponseEntity.ok(ticketService.updateStatus(id, status));
    }

    // ================= SINGLE =================
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToDTO(ticketService.getTicketById(id)));
    }

    // ================= ADMIN COUNT =================
    @GetMapping("/admin/count")
    public ResponseEntity<Long> getOpenTicketsCount() {
        return ResponseEntity.ok(ticketService.getOpenTicketsCount());
    }

    // ================= MESSAGES =================
    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(
                messageRepository.findByTicket_Id(id)
                        .stream()
                        .map(this::mapMessageToDTO)
                        .toList());
    }

    // ================= SEND MESSAGE =================
    @PostMapping("/{id}/messages")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long id,
            @RequestParam String content,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        Ticket ticket = ticketService.getTicketById(id);

        Message msg = new Message();
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setTicket(ticket);

        msg.setSender(user.getRole().name().equals("ADMIN") ? "ADMIN" : "USER");

        return ResponseEntity.ok(messageRepository.save(msg));
    }

    // ================= DTO MAPPERS =================
    private TicketResponse mapToDTO(Ticket ticket) {

        TicketResponse dto = new TicketResponse();

        dto.setId(ticket.getId());
        dto.setSubject(ticket.getSubject());
        dto.setStatus(ticket.getStatus());
        dto.setUserName(ticket.getUser().getName());

        dto.setMessages(
                ticket.getMessages().stream()
                        .map(this::mapMessageToDTO)
                        .toList());

        return dto;
    }

    private MessageResponse mapMessageToDTO(Message msg) {
        MessageResponse m = new MessageResponse();
        m.setId(msg.getId());
        m.setSender(msg.getSender());
        m.setContent(msg.getContent());
        return m;
    }
}