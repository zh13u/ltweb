package org.example.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.core.sync.RequestBody;
import java.io.IOException;

@Service
@Slf4j
public class AwsS3Service {

    private final String bucketName = "phone-shopbug";

    @Value("${aws.s3.accessKey}")
    private String awsS3AccessKey;
    @Value("${aws.s3.secretKey}")
    private String awsS3SecretKey;


    private final String BUCKET_NAME = "phone-shopbug";

    public String saveImageToS3(MultipartFile photo) {
        try {
            // Get original file name
            String s3FileName = photo.getOriginalFilename();
            
            // Check if AWS credentials are configured
            if (awsS3AccessKey == null || awsS3AccessKey.isEmpty() || 
                awsS3SecretKey == null || awsS3SecretKey.isEmpty()) {
                log.error("AWS S3 credentials not configured. Cannot upload image.");
                throw new RuntimeException("AWS S3 credentials are required to upload images. Please configure AWS_S3_ACCESS_KEY and AWS_S3_SECRET_KEY.");
            }

            // Create AWS credentials using access key and secret key
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(awsS3AccessKey, awsS3SecretKey);

            // Create S3 client with config credentials and region
            S3Client s3Client = S3Client.builder()
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .region(Region.AP_SOUTHEAST_2)
                    .build();

            // Set metadata for the object
            String contentType = "image/jpeg"; // Default to jpeg
            String originalFilename = photo.getOriginalFilename();
            if (originalFilename != null) {
                if (originalFilename.endsWith(".png")) {
                    contentType = "image/png";
                } else if (originalFilename.endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (originalFilename.endsWith(".bmp")) {
                    contentType = "image/bmp";
                } else if (originalFilename.endsWith(".tiff")) {
                    contentType = "image/tiff";
                } else if (originalFilename.endsWith(".webp")) {
                    contentType = "image/webp";
                }
            }

            // Create a put request to upload the image to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(BUCKET_NAME)
                    .key(s3FileName)
                    .contentType(contentType)
                    .build();

            // Upload the image
            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(photo.getBytes()));

            // Return the S3 file URL
            return "https://" + BUCKET_NAME + ".s3.ap-southeast-2.amazonaws.com/" + s3FileName;

        } catch (IOException e) {
            log.error("Error while uploading image to S3: {}", e.getMessage());
            throw new RuntimeException("Error while saving image to S3");
        }
    }
}