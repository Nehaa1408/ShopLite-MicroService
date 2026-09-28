package com.ecommerce.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.order_service.dto.DeliveryOtpNotificationRequest;
import com.ecommerce.order_service.dto.OrderPlacedNotificationRequest;
import com.ecommerce.order_service.dto.OrderStatusNotificationRequest;
import com.ecommerce.order_service.dto.PaymentNotificationRequest;

@FeignClient(name = "notification-service")
public interface NotificationClient {

        @PostMapping("/api/notifications/order-placed")
        void sendOrderPlacedEmail(
                        @RequestParam("email") String email,
                        @RequestParam("name") String name,
                        @RequestParam("orderId") Long orderId,
                        @RequestParam("amount") Double amount);

        @PostMapping("/api/notifications/order-placed")
        void sendOrderPlacedEmail(
                        @RequestBody OrderPlacedNotificationRequest request);

        @PostMapping("/api/notifications/payment")
        void sendPaymentNotification(
                        @RequestBody PaymentNotificationRequest request);

        @PostMapping("/api/notifications/order-status")
        void sendOrderStatusNotification(
                        @RequestBody OrderStatusNotificationRequest request);

        @PostMapping("/api/notifications/delivery-otp")
        void sendDeliveryOtpNotification(
                        @RequestBody DeliveryOtpNotificationRequest request);
}
