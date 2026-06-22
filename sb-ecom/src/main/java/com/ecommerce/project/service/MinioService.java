package com.ecommerce.project.service;

import io.minio.*;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MinioService {

    private static final Logger log = LoggerFactory.getLogger(MinioService.class);

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket:shopnest-images}")
    private String bucket;

    @Value("${minio.endpoint:http://minio:9000}")
    private String endpoint;

    // Ensure bucket exists on startup
    public void init() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                // Make bucket public for reading images
                String policy = """
                    {
                      "Version":"2012-10-17",
                      "Statement":[{
                        "Effect":"Allow",
                        "Principal":"*",
                        "Action":["s3:GetObject"],
                        "Resource":["arn:aws:s3:::%s/*"]
                      }]
                    }
                    """.formatted(bucket);
                minioClient.setBucketPolicy(
                        SetBucketPolicyArgs.builder().bucket(bucket).config(policy).build());
                log.info("Created MinIO bucket: {}", bucket);
            }
        } catch (Exception e) {
            log.error("Failed to initialize MinIO bucket: {}", e.getMessage());
        }
    }

    // Upload image and return filename
    public String uploadImage(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");

            try (InputStream is = file.getInputStream()) {
                minioClient.putObject(PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(filename)
                        .stream(is, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());
            }
            log.info("Uploaded image to MinIO: {}", filename);
            return filename;
        } catch (Exception e) {
            log.error("Failed to upload image to MinIO: {}", e.getMessage());
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    // Get public URL for an image
    public String getImageUrl(String filename) {
        return endpoint + "/" + bucket + "/" + filename;
    }

    // Delete image
    public void deleteImage(String filename) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(filename)
                    .build());
            log.info("Deleted image from MinIO: {}", filename);
        } catch (Exception e) {
            log.error("Failed to delete image from MinIO: {}", e.getMessage());
        }
    }
}
