package com.ecommerce.shoplite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.ecommerce.shoplite.entity.Order;
import com.ecommerce.shoplite.entity.OrderItem;

@Service
public class EmailService {

        @Autowired
        private JavaMailSender mailSender;

        // ================= SEND DELIVERY OTP =================
        public void sendDeliveryOtp(
                        String toEmail,
                        String customerName,
                        String otp) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Delivery OTP");

                message.setText(
                                "Hello " + customerName + ",\n\n"
                                                + "Your ShopLite delivery OTP is: "
                                                + otp
                                                + "\n\n"
                                                + "This OTP is valid for 5 minutes.\n\n"
                                                + "Please share this OTP only after receiving your order.\n\n"
                                                + "Thank you,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= DELIVERY SUCCESS EMAIL =================
        public void sendDeliverySuccessEmail(
                        String toEmail,
                        String customerName,
                        Order order) {

                StringBuilder itemsText = new StringBuilder();

                for (OrderItem item : order.getItems()) {

                        itemsText.append("• ")
                                        .append(item.getProduct().getName())
                                        .append(" | Qty: ")
                                        .append(item.getQuantity())
                                        .append(" | $")
                                        .append(item.getPrice())
                                        .append("\n");
                }

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Order Delivered");

                message.setText(
                                "Hello " + customerName + ",\n\n"

                                                + "Your order has been successfully delivered.\n\n"

                                                + "Delivered Items:\n\n"

                                                + itemsText.toString()

                                                + "\nTotal Amount: $"
                                                + order.getTotalAmount()

                                                + "\n\nThank you for shopping with ShopLite.\n\n"

                                                + "We hope to serve you again!\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= SIGNUP OTP EMAIL =================
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
}