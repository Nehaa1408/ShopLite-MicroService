package com.ecommerce.order_service.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")

public class UploadController {

    private static final String UPLOAD_DIR
            = System.getProperty("user.dir") + "/uploads/payments/";

    @PostMapping("/payment-screenshot")
    public ResponseEntity<String> uploadPaymentScreenshot(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        File uploadDir = new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String fileName = UUID.randomUUID()
                + "_"
                + file.getOriginalFilename();

        File destination = new File(UPLOAD_DIR + fileName);

        file.transferTo(destination);

        String imageUrl
                = "http://localhost:8084/uploads/payments/" + fileName;

        return ResponseEntity.ok(imageUrl);
    }
}
