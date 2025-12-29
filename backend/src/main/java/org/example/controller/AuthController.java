package org.example.controller;

import org.example.service.interf.UserService;
import org.example.dto.ForgotPasswordRequest;
import org.example.dto.LoginRequest;
import org.example.dto.ResetPasswordRequest;
import org.example.dto.Response;
import org.example.dto.UserDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody @Valid UserDto registrationRequest){
        log.info("Controller: Register user");
        return ResponseEntity.ok(userService.registerUser(registrationRequest));
    }
    
    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody @Valid LoginRequest loginRequest){
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Response> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request){
        log.info("Controller: Forgot password for email: {}", request.getEmail());
        return ResponseEntity.ok(userService.forgotPassword(request));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Response> resetPassword(@RequestBody @Valid ResetPasswordRequest request){
        log.info("Controller: Reset password with token");
        return ResponseEntity.ok(userService.resetPassword(request));
    }
}