package com.ecommerce.shoplite.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionResponse {

    private String transactionId;

    private Long orderId;

    private String customerName;

    private String customerEmail;

    private double amount;

    private String paymentMethod;

    private String paymentStatus;

    private String paymentScreenshot;

    private String paidAt;
}