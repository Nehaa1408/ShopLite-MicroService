package com.ecommerce.ticket_service.controller;

import com.ecommerce.ticket_service.dto.AdminResponseRequest;
import com.ecommerce.ticket_service.dto.CreateTicketRequest;
import com.ecommerce.ticket_service.dto.TicketResponse;
import com.ecommerce.ticket_service.dto.UpdateTicketRequest;
import com.ecommerce.ticket_service.dto.UpdateTicketStatusRequest;
import com.ecommerce.ticket_service.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

        private final TicketService ticketService;

        public TicketController(TicketService ticketService) {
                this.ticketService = ticketService;
        }

        // =====================================================
        // CUSTOMER APIs
        // =====================================================

        // Create ticket
        @PostMapping
        public ResponseEntity<TicketResponse> createTicket(
                        @RequestHeader("X-User-Id") Long userId,
                        @Valid @RequestBody CreateTicketRequest request) {

                TicketResponse response = ticketService.createTicket(userId, request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        // Get customer's tickets
        @GetMapping("/my")
        public ResponseEntity<List<TicketResponse>> getMyTickets(
                        @RequestHeader("X-User-Id") Long userId) {

                return ResponseEntity.ok(
                                ticketService.getMyTickets(userId));
        }

        // Get particular customer ticket
        @GetMapping("/{ticketId}")
        public ResponseEntity<TicketResponse> getMyTicketById(
                        @RequestHeader("X-User-Id") Long userId,
                        @PathVariable Long ticketId) {

                return ResponseEntity.ok(
                                ticketService.getMyTicketById(userId, ticketId));
        }

        // Update customer's ticket
        @PutMapping("/{ticketId}")
        public ResponseEntity<TicketResponse> updateMyTicket(
                        @RequestHeader("X-User-Id") Long userId,
                        @PathVariable Long ticketId,
                        @Valid @RequestBody UpdateTicketRequest request) {

                return ResponseEntity.ok(
                                ticketService.updateMyTicket(
                                                userId,
                                                ticketId,
                                                request));
        }

        // =====================================================
        // ADMIN APIs
        // =====================================================

        // Get all tickets
        @GetMapping("/admin")
        public ResponseEntity<List<TicketResponse>> getAllTickets() {

                return ResponseEntity.ok(
                                ticketService.getAllTickets());
        }

        // Get particular ticket for admin
        @GetMapping("/admin/{ticketId}")
        public ResponseEntity<TicketResponse> getTicketById(
                        @PathVariable Long ticketId) {

                return ResponseEntity.ok(
                                ticketService.getTicketById(ticketId));
        }

        // Update ticket status
        @PutMapping("/admin/{ticketId}/status")
        public ResponseEntity<TicketResponse> updateTicketStatus(
                        @PathVariable Long ticketId,
                        @Valid @RequestBody UpdateTicketStatusRequest request) {

                return ResponseEntity.ok(
                                ticketService.updateTicketStatus(
                                                ticketId,
                                                request));
        }

        // Add admin response
        @PutMapping("/admin/{ticketId}/response")
        public ResponseEntity<TicketResponse> addAdminResponse(
                        @PathVariable Long ticketId,
                        @Valid @RequestBody AdminResponseRequest request) {

                return ResponseEntity.ok(
                                ticketService.addAdminResponse(
                                                ticketId,
                                                request));
        }

        // Get ticket count
        @GetMapping("/admin/count")
        public ResponseEntity<Long> getTicketCount() {

                return ResponseEntity.ok(
                                ticketService.getTicketCount());
        }
}