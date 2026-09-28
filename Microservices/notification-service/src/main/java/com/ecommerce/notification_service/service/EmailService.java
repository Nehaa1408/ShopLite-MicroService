package com.ecommerce.notification_service.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ecommerce.notification_service.dto.DeliveryOtpNotificationRequest;
import com.ecommerce.notification_service.dto.OrderItemNotification;
import com.ecommerce.notification_service.dto.OrderPlacedNotificationRequest;
import com.ecommerce.notification_service.dto.OrderStatusNotificationRequest;
import com.ecommerce.notification_service.dto.PaymentNotificationRequest;

@Service
public class EmailService {

        private final JavaMailSender mailSender;

        public EmailService(JavaMailSender mailSender) {
                this.mailSender = mailSender;
        }

        public void sendTestEmail(
                        String toEmail,
                        String customerName) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Notification Service Test");

                message.setText(
                                "Hello " + customerName + ",\n\n"
                                                + "This is a test email from the ShopLite Notification Service.\n\n"
                                                + "Email sending is working successfully.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        public void sendSignupOtp(
                        String toEmail,
                        String customerName,
                        String otp) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Signup Verification");

                message.setText(
                                "Hello " + customerName + ",\n\n"
                                                + "Your ShopLite signup OTP is: "
                                                + otp
                                                + "\n\nThis OTP is valid for 5 minutes.\n\n"
                                                + "If you did not request this signup, please ignore this email.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        public void sendForgotPasswordOtp(
                        String toEmail,
                        String otp) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Password Reset OTP");

                message.setText(
                                """
                                                Hello,

                                                Your ShopLite password reset OTP is: """
                                                + otp
                                                + "\n\nThis OTP is valid for 5 minutes.\n\n"
                                                + "If you did not request password reset, please ignore this email.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= PASSWORD RESET SUCCESS =================
        public void sendPasswordResetSuccessEmail(
                        String toEmail,
                        String customerName) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);
                message.setSubject("ShopLite - Password Reset Successful");

                message.setText(
                                "Hello " + customerName + ",\n\n"
                                                + "Your ShopLite account password has been reset successfully.\n\n"
                                                + "If you made this change, no further action is required.\n\n"
                                                + "If you did not reset your password, please contact ShopLite support immediately.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite Team");

                mailSender.send(message);
        }

        // ================= LOGIN SUCCESS =================
        public void sendLoginSuccessEmail(
                        String toEmail,
                        String customerName) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);
                message.setSubject("ShopLite - Login Successful");

                message.setText(
                                "Hello " + customerName + ",\n\n"
                                                + "You have successfully logged in to your ShopLite account.\n\n"
                                                + "If this login was not made by you, please contact ShopLite support immediately.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite Team");

                mailSender.send(message);
        }

        public void sendOrderPlacedEmail(
                        OrderPlacedNotificationRequest request) {

                StringBuilder itemsText = new StringBuilder();

                for (OrderItemNotification item : request.getItems()) {

                        itemsText.append("• ")
                                        .append(item.getProductName())
                                        .append(" | Qty: ")
                                        .append(item.getQuantity())
                                        .append(" | Price: ₹")
                                        .append(item.getPrice())
                                        .append(" | Subtotal: ₹")
                                        .append(item.getSubtotal())
                                        .append("\n");
                }

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(request.getEmail());

                message.setSubject("ShopLite - Order Placed Successfully");

                message.setText(
                                "Hello " + request.getName() + ",\n\n"
                                                + "Your ShopLite order has been placed successfully.\n\n"

                                                + "Order Details:\n"
                                                + "Order ID: #" + request.getOrderId() + "\n"
                                                + "Payment Method: " + request.getPaymentMethod() + "\n"
                                                + "Payment Status: " + request.getPaymentStatus() + "\n\n"

                                                + "Ordered Items:\n\n"
                                                + itemsText

                                                + "\nTotal Amount: ₹"
                                                + request.getTotalAmount()
                                                + "\n\n"

                                                + "Thank you for shopping with ShopLite.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite Team");

                mailSender.send(message);
        }

        public void sendPaymentNotificationEmail(
                        PaymentNotificationRequest request) {

                String subject;

                if ("SUCCESS".equalsIgnoreCase(request.getPaymentStatus())) {
                        subject = "Payment Successful - ShopLite Order #" + request.getOrderId();
                } else {
                        subject = "Payment Failed - ShopLite Order #" + request.getOrderId();
                }

                String body;

                if ("SUCCESS".equalsIgnoreCase(request.getPaymentStatus())) {

                        body = """
                                        Hi %s,

                                        Your payment for ShopLite order #%d was successful.

                                        Payment Details:
                                        Order ID: #%d
                                        Payment Method: %s
                                        Payment Status: %s
                                        Amount Paid: ₹%.2f

                                        Thank you for shopping with ShopLite.

                                        Regards,
                                        ShopLite Team
                                        """.formatted(
                                        request.getName(),
                                        request.getOrderId(),
                                        request.getOrderId(),
                                        request.getPaymentMethod(),
                                        request.getPaymentStatus(),
                                        request.getAmount());

                } else {

                        body = """
                                        Hi %s,

                                        Unfortunately, your payment for ShopLite order #%d was unsuccessful.

                                        Payment Details:
                                        Order ID: #%d
                                        Payment Method: %s
                                        Payment Status: %s
                                        Amount: ₹%.2f

                                        Please try the payment again or choose another payment method.

                                        Regards,
                                        ShopLite Team
                                        """.formatted(
                                        request.getName(),
                                        request.getOrderId(),
                                        request.getOrderId(),
                                        request.getPaymentMethod(),
                                        request.getPaymentStatus(),
                                        request.getAmount());
                }

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(request.getEmail());
                message.setSubject(subject);
                message.setText(body);

                mailSender.send(message);
        }

        public void sendOrderStatusNotificationEmail(
                        OrderStatusNotificationRequest request) {

                String status = request.getOrderStatus().toUpperCase();

                String subject;
                String message;

                switch (status) {

                        case "PLACED" -> {
                                subject = "ShopLite - Order Placed";
                                message = "Your order has been placed successfully.";
                        }

                        case "CONFIRMED" -> {
                                subject = "ShopLite - Order Confirmed";
                                message = "Your order has been confirmed.";
                        }

                        case "PACKED" -> {
                                subject = "ShopLite - Order Packed";
                                message = "Your order has been packed and is ready for shipment.";
                        }

                        case "SHIPPED" -> {
                                subject = "ShopLite - Order Shipped";
                                message = "Your order has been shipped.";
                        }

                        case "OUT_FOR_DELIVERY" -> {
                                subject = "ShopLite - Out for Delivery";
                                message = "Your order is out for delivery.";
                        }

                        case "DELIVERED" -> {
                                subject = "ShopLite - Order Delivered";
                                message = "Your order has been delivered successfully.";
                        }

                        case "CANCELLED" -> {
                                subject = "ShopLite - Order Cancelled";
                                message = "Your order has been cancelled.";
                        }

                        case "DELIVERY_FAILED" -> {
                                subject = "ShopLite - Delivery Failed";
                                message = "Unfortunately, delivery of your order was unsuccessful.";
                        }

                        default -> throw new IllegalArgumentException(
                                        "Unsupported order status: " + status);
                }

                SimpleMailMessage mail = new SimpleMailMessage();

                mail.setTo(request.getEmail());
                mail.setSubject(subject);

                mail.setText(
                                "Hello " + request.getName() + ",\n\n"
                                                + message + "\n\n"
                                                + "Order Details:\n"
                                                + "Order ID: #" + request.getOrderId() + "\n"
                                                + "Order Status: " + status + "\n\n"
                                                + "Regards,\n"
                                                + "ShopLite Team");

                mailSender.send(mail);
        }
        // ================= DELIVERY OTP =================

        public void sendDeliveryOtpEmail(
                        DeliveryOtpNotificationRequest request) {

                SimpleMailMessage mail = new SimpleMailMessage();

                mail.setTo(request.getEmail());

                mail.setSubject(
                                "ShopLite - Delivery OTP for Order #" + request.getOrderId());

                mail.setText(
                                "Hello " + request.getName() + ",\n\n"
                                                + "Your delivery OTP for Order #" + request.getOrderId()
                                                + " is: " + request.getOtp() + "\n\n"
                                                + "This OTP is valid for 5 minutes.\n"
                                                + "Please share this OTP with the delivery partner when your order is delivered.\n\n"
                                                + "Regards,\n"
                                                + "ShopLite Team");

                mailSender.send(mail);
        }
}