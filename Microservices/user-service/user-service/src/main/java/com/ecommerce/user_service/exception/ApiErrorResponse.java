package com.ecommerce.user_service.exception;

import java.time.LocalDateTime;

public class ApiErrorResponse {

    private final boolean success;
    private final String message;
    private final LocalDateTime timestamp;

    public ApiErrorResponse(boolean success, String message, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}