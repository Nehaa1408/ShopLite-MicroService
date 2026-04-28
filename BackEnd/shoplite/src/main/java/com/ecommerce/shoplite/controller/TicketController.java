package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.entity.Ticket;
import com.ecommerce.shoplite.repository.UserRepository;
import com.ecommerce.shoplite.security.JwtUtil;
import com.ecommerce.shoplite.service.TicketService;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(String token) {
        token = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // USER → create ticket
    @PostMapping
    public Ticket createTicket(@RequestHeader("Authorization") String token,
            @RequestParam String subject,
            @RequestParam String message) {

        Long userId = getUserId(token);
        return ticketService.createTicket(userId, subject, message);
    }

    // USER → view own tickets
    @GetMapping
    public List<Ticket> getUserTickets(@RequestHeader("Authorization") String token) {

        Long userId = getUserId(token);
        return ticketService.getUserTickets(userId);
    }

    // ADMIN → view all tickets
    @GetMapping("/admin")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // ADMIN → update status
    @PutMapping("/{id}")
    public Ticket updateStatus(@PathVariable Long id,
            @RequestParam String status) {

        return ticketService.updateStatus(id, status);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }
}