package com.ecommerce.shoplite.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnRequestResponse {

    private Long returnId;

    private Long orderId;

    private String customerName;

    private String customerEmail;

    private String returnReason;

    private String status;

   private String returnRequestedDate;

    private String selectedItems;

    private double refundAmount;

    private String pickupPartnerName;
    private List<OrderItemResponse> items;
}