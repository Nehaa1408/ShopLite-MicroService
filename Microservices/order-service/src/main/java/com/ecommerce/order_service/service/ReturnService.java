package com.ecommerce.order_service.service;

import java.util.List;

import com.ecommerce.order_service.dto.CreateReturnRequestDTO;
import com.ecommerce.order_service.dto.ReturnRequestResponse;

public interface ReturnService {

    ReturnRequestResponse createReturnRequest(
            CreateReturnRequestDTO request,
            Long userId);

    List<ReturnRequestResponse> getUserReturns(Long userId);

    List<ReturnRequestResponse> getAllReturns();

    ReturnRequestResponse assignPickupPartner(
            Long returnId,
            Long deliveryUserId);

    ReturnRequestResponse updateReturnStatus(
            Long returnId,
            String status);

    List<ReturnRequestResponse> getAssignedReturns(Long userId);

    List<ReturnRequestResponse> getCompletedPickups(Long userId);

    String sendPickupOtp(
            Long returnId,
            Long userId);

    String verifyPickupOtp(
            Long returnId,
            String otp,
            Long userId);
}