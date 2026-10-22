package com.ecommerce.ticket_service.dto;

import java.time.LocalDateTime;

import com.ecommerce.ticket_service.enums.TicketCategory;
import com.ecommerce.ticket_service.enums.TicketPriority;
import com.ecommerce.ticket_service.enums.TicketStatus;

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

    public TicketResponse() {
    }

    public TicketResponse(Long ticketId, Long userId, Long orderId, String subject, String description,
            TicketCategory category, TicketPriority priority, TicketStatus status, String adminResponse,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.orderId = orderId;
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.adminResponse = adminResponse;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
