package com.ecommerce.order_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReturnRequestDTO {

    private Long orderId;

    private String returnReason;

    private String selectedItems;
}