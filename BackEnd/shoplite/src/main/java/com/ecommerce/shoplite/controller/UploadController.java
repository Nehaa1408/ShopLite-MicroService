package com.ecommerce.shoplite.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir")
            + "/uploads/payments/";

    @PostMapping("/payment-screenshot")
    public ResponseEntity<String> uploadPaymentScreenshot(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        // CREATE DIRECTORY IF NOT EXISTS
        File uploadDir = new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // UNIQUE FILE NAME
        String fileName = UUID.randomUUID()
                + "_"
                + file.getOriginalFilename();

        // SAVE FILE
        File destination = new File(UPLOAD_DIR + fileName);

        file.transferTo(destination);

        // RETURN IMAGE URL
        String imageUrl = "http://localhost:8080/uploads/payments/"
                + fileName;

        return ResponseEntity.ok(imageUrl);
    }
}