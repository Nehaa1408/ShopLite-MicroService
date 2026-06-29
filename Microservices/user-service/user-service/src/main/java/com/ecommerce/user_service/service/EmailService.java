package com.ecommerce.user_service.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ================= SIGNUP OTP =================
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
                        + "Please do not share this OTP with anyone.\n"
                        + "ShopLite team will never ask for your OTP.\n\n"
                        + "If you did not request this signup, please ignore this email.\n\n"
                        + "Regards,\n"
                        + "ShopLite");

        mailSender.send(message);
    }

    // ================= FORGOT PASSWORD OTP =================
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
                        + "Please do not share this OTP with anyone.\n"
                        + "ShopLite team will never ask for your OTP.\n\n"
                        + "If you did not request password reset, please ignore this email.\n\n"
                        + "Regards,\n"
                        + "ShopLite");

        mailSender.send(message);
    }
}