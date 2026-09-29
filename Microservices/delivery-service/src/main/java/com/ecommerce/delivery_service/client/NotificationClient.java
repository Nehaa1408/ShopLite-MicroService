package com.ecommerce.delivery_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ecommerce.delivery_service.dto.DeliveryPartnerNotificationRequest;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/delivery-partner")
    void sendDeliveryPartnerNotification(
            @RequestBody DeliveryPartnerNotificationRequest request);
}