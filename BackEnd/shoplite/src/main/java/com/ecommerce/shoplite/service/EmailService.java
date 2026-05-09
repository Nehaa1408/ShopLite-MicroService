package com.ecommerce.shoplite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.ecommerce.shoplite.entity.Order;
import com.ecommerce.shoplite.entity.OrderItem;
import com.ecommerce.shoplite.entity.ReturnRequest;

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

        // ================= OUT FOR DELIVERY EMAIL =================
        public void sendOutForDeliveryEmail(
                        String toEmail,
                        String customerName,
                        String deliveryPartnerName) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Order Out for Delivery");

                message.setText(
                                "Hello " + customerName + ",\n\n"

                                                + "Good news! Your ShopLite order is now out for delivery.\n\n"

                                                + "Delivery Partner: "
                                                + deliveryPartnerName

                                                + "\n\nYour package is expected to arrive today.\n\n"

                                                + "You can track your order live from your ShopLite account.\n\n"

                                                + "Thank you for shopping with ShopLite.\n\n"

                                                + "Regards,\n"
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

        // ================= RETURN REQUEST EMAIL =================
        public void sendReturnRequestEmail(
                        String toEmail,
                        String customerName,
                        ReturnRequest returnRequest) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Return Request Submitted");

                message.setText(

                                "Hello " + customerName + ",\n\n"

                                                + "Your return request has been submitted successfully.\n\n"

                                                + "Return Details:\n"

                                                + "Return ID: #" + returnRequest.getId() + "\n"

                                                + "Order ID: #" + returnRequest.getOrder().getId() + "\n"

                                                + "Selected Items: "
                                                + returnRequest.getSelectedItems() + "\n"

                                                + "Reason: "
                                                + returnRequest.getReturnReason() + "\n\n"

                                                + "Return Policies:\n"

                                                + "- Product should not be customer damaged\n"

                                                + "- Original tags must be attached\n"

                                                + "- Original packaging should be available\n"

                                                + "- Used products may not be accepted\n"

                                                + "- Return request valid within 7 days only\n\n"

                                                + "Our team will review your request shortly.\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= RETURN PICKUP SUCCESS EMAIL =================
        public void sendReturnPickupSuccessEmail(
                        String toEmail,
                        String customerName,
                        ReturnRequest returnRequest) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Return Pickup Successful");

                message.setText(

                                "Hello " + customerName + ",\n\n"

                                                + "Your return pickup has been completed successfully.\n\n"

                                                + "Return Details:\n"

                                                + "Return ID: #"
                                                + returnRequest.getId()
                                                + "\n"

                                                + "Order ID: #"
                                                + returnRequest.getOrder().getId()
                                                + "\n"

                                                + "Selected Items: "
                                                + returnRequest.getSelectedItems()
                                                + "\n\n"

                                                + "Our inspection team will now verify the returned product.\n\n"

                                                + "You will receive another update once the return is approved or rejected.\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= PICKUP OTP EMAIL =================
        public void sendOtpEmail(
                        String toEmail,
                        String customerName,
                        String otp) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Pickup OTP");

                message.setText(
                                "Hello " + customerName + ",\n\n"

                                                + "Your return pickup OTP is: "
                                                + otp

                                                + "\n\nThis OTP is valid for 10 minutes.\n\n"

                                                + "Please share this OTP only after handing over the returned product.\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= REFUND APPROVED EMAIL =================
        public void sendRefundApprovedEmail(
                        String toEmail,
                        String customerName,
                        ReturnRequest returnRequest) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Refund Approved");

                message.setText(

                                "Hello " + customerName + ",\n\n"

                                                + "Your return request has been approved.\n\n"

                                                + "Refund Details:\n"

                                                + "Return ID: #"
                                                + returnRequest.getId()
                                                + "\n"

                                                + "Refund Amount: $"
                                                + returnRequest.getRefundAmount()
                                                + "\n\n"

                                                + "Your refund will be processed shortly.\n\n"

                                                + "Thank you for shopping with ShopLite.\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }

        // ================= RETURN REJECTED EMAIL =================
        public void sendReturnRejectedEmail(
                        String toEmail,
                        String customerName,
                        ReturnRequest returnRequest) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);

                message.setSubject(
                                "ShopLite Return Rejected");

                message.setText(

                                "Hello " + customerName + ",\n\n"

                                                + "Your return request has been rejected after inspection.\n\n"

                                                + "Return ID: #"
                                                + returnRequest.getId()
                                                + "\n\n"

                                                + "If you need more information, please contact support.\n\n"

                                                + "Regards,\n"
                                                + "ShopLite");

                mailSender.send(message);
        }
}