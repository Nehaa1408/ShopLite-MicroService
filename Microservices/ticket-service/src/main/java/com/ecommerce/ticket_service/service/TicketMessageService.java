package com.ecommerce.ticket_service.service;

import com.ecommerce.ticket_service.dto.TicketMessageResponse;
import com.ecommerce.ticket_service.entity.TicketMessage;
import com.ecommerce.ticket_service.repository.TicketMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TicketMessageService {

    private final TicketMessageRepository ticketMessageRepository;

    public TicketMessageService(
            TicketMessageRepository ticketMessageRepository
    ) {
        this.ticketMessageRepository = ticketMessageRepository;
    }

    @Transactional(readOnly = true)
    public List<TicketMessageResponse> getMessages(Long ticketId) {

        return ticketMessageRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketMessageResponse addMessage(
            Long ticketId,
            Long senderId,
            String sender,
            String content
    ) {

        TicketMessage message = TicketMessage.builder()
                .ticketId(ticketId)
                .senderId(senderId)
                .sender(sender)
                .content(content)
                .build();

        TicketMessage savedMessage =
                ticketMessageRepository.save(message);

        return mapToResponse(savedMessage);
    }

    private TicketMessageResponse mapToResponse(
            TicketMessage message
    ) {

        return TicketMessageResponse.builder()
                .id(message.getId())
                .ticketId(message.getTicketId())
                .senderId(message.getSenderId())
                .sender(message.getSender())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}