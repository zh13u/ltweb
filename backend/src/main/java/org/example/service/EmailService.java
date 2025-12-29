package org.example.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:80}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Đặt lại mật khẩu - Phone Shop");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String emailBody = "Xin chào,\n\n" +
                    "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n\n" +
                    "Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu:\n" +
                    resetUrl + "\n\n" +
                    "Liên kết này sẽ hết hạn sau 1 giờ.\n\n" +
                    "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                    "Trân trọng,\n" +
                    "Đội ngũ Phone Shop";
            
            message.setText(emailBody);
            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Error sending password reset email to: {}", toEmail, e);
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }
}

