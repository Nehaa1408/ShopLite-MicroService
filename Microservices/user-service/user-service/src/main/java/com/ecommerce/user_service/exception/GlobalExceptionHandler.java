package com.ecommerce.user_service.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ApiErrorResponse> handleUserNotFoundException(
                        UserNotFoundException ex) {

                ApiErrorResponse response = new ApiErrorResponse(
                                false,
                                ex.getMessage(),
                                java.time.LocalDateTime.now());

                return new ResponseEntity<>(
                                response,
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(InvalidPasswordException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidPasswordException(
                        InvalidPasswordException ex) {

                ApiErrorResponse response = new ApiErrorResponse(
                                false,
                                ex.getMessage(),
                                java.time.LocalDateTime.now());

                return new ResponseEntity<>(
                                response,
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExistsException(
                        EmailAlreadyExistsException ex) {

                return new ResponseEntity<>(
                                new ApiErrorResponse(false, ex.getMessage(), LocalDateTime.now()),
                                HttpStatus.CONFLICT);
        }

        @ExceptionHandler(InvalidOtpException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidOtpException(
                        InvalidOtpException ex) {

                return new ResponseEntity<>(
                                new ApiErrorResponse(false, ex.getMessage(), LocalDateTime.now()),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(InvalidTokenException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidTokenException(
                        InvalidTokenException ex) {

                return new ResponseEntity<>(
                                new ApiErrorResponse(false, ex.getMessage(), LocalDateTime.now()),
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiErrorResponse> handleRuntimeException(
                        RuntimeException ex) {

                ApiErrorResponse response = new ApiErrorResponse(
                                false,
                                ex.getMessage(),
                                LocalDateTime.now());

                return new ResponseEntity<>(
                                response,
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidationException(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("timestamp", java.time.LocalDateTime.now());
                response.put("errors", errors);

                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiErrorResponse> handleException(
                        Exception ex) {

                ApiErrorResponse response = new ApiErrorResponse(
                                false,
                                "Something went wrong.",
                                LocalDateTime.now());

                return new ResponseEntity<>(
                                response,
                                HttpStatus.INTERNAL_SERVER_ERROR);
        }
}