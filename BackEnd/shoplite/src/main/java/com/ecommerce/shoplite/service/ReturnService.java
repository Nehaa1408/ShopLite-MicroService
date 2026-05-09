package com.ecommerce.shoplite.service;

import java.util.List;

import com.ecommerce.shoplite.dto.CreateReturnRequestDTO;
import com.ecommerce.shoplite.dto.ReturnRequestResponse;
import com.ecommerce.shoplite.entity.User;

public interface ReturnService {

        ReturnRequestResponse createReturnRequest(
                        CreateReturnRequestDTO request,
                        User user);

        List<ReturnRequestResponse> getUserReturns(
                        User user);

        List<ReturnRequestResponse> getAllReturns();

        ReturnRequestResponse assignPickupPartner(
                        Long returnId,
                        Long deliveryUserId);

        ReturnRequestResponse updateReturnStatus(
                        Long returnId,
                        String status);

        List<ReturnRequestResponse> getAssignedReturns(
                        User user);

        // SEND PICKUP OTP
        String sendPickupOtp(
                        Long returnId,
                        User user);

        // VERIFY PICKUP OTP
        String verifyPickupOtp(
                        Long returnId,
                        String otp,
                        User user);
}