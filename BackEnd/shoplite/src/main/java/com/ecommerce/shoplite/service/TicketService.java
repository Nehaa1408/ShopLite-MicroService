package com.ecommerce.shoplite.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.entity.Message;
import com.ecommerce.shoplite.entity.Ticket;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // ================= CREATE =================
    public Ticket createTicket(User user, String subject, String messageText) {

        Ticket ticket = new Ticket();
        ticket.setSubject(subject);
        ticket.setStatus("OPEN");
        ticket.setUser(user);

        List<Message> messages = new ArrayList<>();

        Message message = new Message();
        message.setContent(messageText);
        message.setSender("USER");
        message.setTimestamp(LocalDateTime.now());
        message.setTicket(ticket);

        messages.add(message);
        ticket.setMessages(messages);

        return ticketRepository.save(ticket);
    }

    // ================= USER TICKETS =================
    public List<Ticket> getUserTickets(User user) {
        return ticketRepository.findByUser(user);
    }

    // ================= ADMIN =================
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // ================= UPDATE STATUS =================
    public Ticket updateStatus(Long ticketId, String status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    // ================= GET SINGLE =================
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // ================= COUNT =================
    public long getOpenTicketsCount() {
        return ticketRepository.countByStatus("OPEN");
    }
}