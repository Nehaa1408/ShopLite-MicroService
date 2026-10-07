package com.ecommerce.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.admin_service.client.ReturnClient;
import com.ecommerce.admin_service.dto.ReturnRequestResponse;

@Service
public class AdminReturnService {

    private final ReturnClient returnClient;

    public AdminReturnService(ReturnClient returnClient) {
        this.returnClient = returnClient;
    }

    // =========================
    // GET ALL RETURNS
    // =========================

    public List<ReturnRequestResponse> getAllReturns() {

        return returnClient.getAllReturns();
    }

    // =========================
    // ASSIGN PICKUP PARTNER
    // =========================

    public ReturnRequestResponse assignPickupPartner(
            Long returnId,
            Long deliveryUserId) {

        return returnClient.assignPickupPartner(
                returnId,
                deliveryUserId);
    }

    // =========================
    // UPDATE RETURN STATUS
    // =========================

    public ReturnRequestResponse updateReturnStatus(
            Long returnId,
            String status) {

        return returnClient.updateReturnStatus(
                returnId,
                status);
    }
}