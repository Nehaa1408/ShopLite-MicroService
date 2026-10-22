package com.ecommerce.ticket_service.dto;

import com.ecommerce.ticket_service.enums.TicketCategory;
import com.ecommerce.ticket_service.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateTicketRequest {

    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject cannot exceed 200 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private Long orderId;

    public CreateTicketRequest() {
    }

    public CreateTicketRequest(String subject, String description, TicketCategory category,
                              TicketPriority priority, Long orderId) {
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.priority = priority;
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
