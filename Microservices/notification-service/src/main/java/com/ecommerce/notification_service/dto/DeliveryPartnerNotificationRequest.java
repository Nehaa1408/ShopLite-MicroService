package com.ecommerce.notification_service.dto;

import lombok.Data;

@Data
public class DeliveryPartnerNotificationRequest {

    private String email;
    private String name;
    private Long deliveryPartnerId;
    private String notificationType;
}