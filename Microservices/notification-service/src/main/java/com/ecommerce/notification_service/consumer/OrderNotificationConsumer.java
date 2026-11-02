package com.ecommerce.notification_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.ecommerce.notification_service.dto.OrderPlacedNotificationRequest;
import com.ecommerce.notification_service.service.EmailService;

@Component
public class OrderNotificationConsumer {

    private final EmailService emailService;

    public OrderNotificationConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(
        topics = "order-created",
        groupId = "notification-service-group"
    )
    public void consumeOrderCreatedEvent(
            OrderPlacedNotificationRequest request) {

        System.out.println(
            "Received order-created event for Order ID: "
            + request.getOrderId()
        );

        emailService.sendOrderPlacedEmail(request);

        System.out.println(
            "Order confirmation email processed for Order ID: "
            + request.getOrderId()
        );
    }
}