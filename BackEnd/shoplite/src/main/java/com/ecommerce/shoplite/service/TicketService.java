package com.ecommerce.shoplite.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.shoplite.entity.Ticket;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.TicketRepository;
import com.ecommerce.shoplite.repository.UserRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public Ticket createTicket(Long userId, String subject, String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setSubject(subject);
        ticket.setMessage(message);
        ticket.setStatus("OPEN");
        ticket.setUser(user);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getUserTickets(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ticketRepository.findByUser(user);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateStatus(Long ticketId, String status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}
