package org.example.security;

import org.example.entity.User;
import org.example.enums.UserRole;
import org.example.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AppInitConfig {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserRepo userRepo;

    @Value("${admin.email}")
    private String ADMIN_EMAIL;

    @Value("${admin.password}")
    private String ADMIN_PASSWORD;

    // This bean just run when application is started not in test
    @Bean
    @ConditionalOnProperty(prefix = "spring.datasource", value = "driver-class-name", havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner init() {
        return args -> {
            log.info("AppInitConfig.init() -> Application started");
            if (userRepo.findByEmail(ADMIN_EMAIL).isEmpty() && userRepo.findByRole(UserRole.ADMIN).isEmpty()) {
                log.info("AppInitConfig.init() -> Creating admin user");
                userRepo.save(User.builder()
                        .email(ADMIN_EMAIL)
                        .name("Admin")
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .phoneNumber("1234567890")
                        .role(UserRole.ADMIN)
                        .build());
            }
        };
    }
}