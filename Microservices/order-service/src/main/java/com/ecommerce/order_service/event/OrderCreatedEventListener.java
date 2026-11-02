package com.ecommerce.order_service.event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.ecommerce.order_service.dto.OrderPlacedNotificationRequest;

@Component
public class OrderCreatedEventListener {

    private static final String TOPIC = "order-created";

    private final KafkaTemplate<String, OrderPlacedNotificationRequest> kafkaTemplate;

    public OrderCreatedEventListener(
            KafkaTemplate<String, OrderPlacedNotificationRequest> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCreated(OrderPlacedNotificationRequest request) {

        kafkaTemplate.send(
                TOPIC,
                String.valueOf(request.getOrderId()),
                request
        );

        System.out.println(
                "Order-created event published for Order ID: "
                        + request.getOrderId()
        );
    }
}