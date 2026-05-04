package com.ecommerce.shoplite.dto;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String subject;
    private String status;
    private String userName;
    private List<MessageResponse> messages;
}