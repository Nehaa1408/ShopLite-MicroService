package com.ecommerce.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.admin_service.dto.ReturnRequestResponse;

@FeignClient(name = "ORDER-SERVICE", contextId = "returnClient")
public interface ReturnClient {

        // =========================
        // GET ALL RETURNS
        // =========================

        @GetMapping("/api/returns/admin")
        List<ReturnRequestResponse> getAllReturns();

        // =========================
        // ASSIGN PICKUP PARTNER
        // =========================

        @PutMapping("/api/returns/admin/{returnId}/assign/{deliveryUserId}")
        ReturnRequestResponse assignPickupPartner(
                        @PathVariable Long returnId,
                        @PathVariable Long deliveryUserId);

        // =========================
        // UPDATE RETURN STATUS
        // =========================

        @PutMapping("/api/returns/admin/{returnId}/status")
        ReturnRequestResponse updateReturnStatus(
                        @PathVariable Long returnId,
                        @RequestParam String status);
}