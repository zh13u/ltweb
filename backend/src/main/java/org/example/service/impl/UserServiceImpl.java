package org.example.service.impl;

import org.example.entity.PasswordResetToken;
import org.example.entity.User;
import org.example.exception.InvalidCredentialsException;
import org.example.exception.NotFoundException;
import org.example.mapper.EntityDtoMapper;
import org.example.repository.PasswordResetTokenRepo;
import org.example.repository.UserRepo;
import org.example.security.JwtUtils;
import org.example.service.EmailService;
import org.example.service.interf.UserService;
import org.example.dto.ForgotPasswordRequest;
import org.example.dto.LoginRequest;
import org.example.dto.ResetPasswordRequest;
import org.example.dto.Response;
import org.example.dto.UserDto;
import org.example.enums.UserRole;
import org.example.util.PasswordValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;
    private final EmailService emailService;
    private final PasswordResetTokenRepo passwordResetTokenRepo;


    // TH1: Username is null => 400
    // TH2: Password is null => 400
    // TH3: Email is null => 400
    // TH4: Phone number not enough length => 400
    // TH5: Email already exists => 400
    // TH6: Register successfully => 200
    @Override
    public Response registerUser(UserDto registrationRequest) {
        UserRole role = UserRole.USER;

        if (userRepo.findByEmail(registrationRequest.getEmail()).isPresent()){
            throw new InvalidCredentialsException("Email already exists");
        }

        // Validate password strength
        if (!PasswordValidator.isValid(registrationRequest.getPassword())) {
            throw new InvalidCredentialsException(PasswordValidator.getPasswordRequirements());
        }

        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .role(role)
                .build();

        User savedUser = userRepo.save(user);
        System.out.println(savedUser);

        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
        return Response.builder()
                .status(200)
                .message("User Successfully Added")
                .user(userDto)
                .build();
    }



    @Override
    public Response loginUser(LoginRequest loginRequest) {

        User user = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new NotFoundException("Email not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Password does not match");
        }
        String token = jwtUtils.generateToken(user);

        return Response.builder()
                .status(200)
                .message("User Successfully Logged In")
                .token(token)
                .expirationTime("6 Month")
                .role(user.getRole().name())
                .build();
    }

    @Override
    public Response getAllUsers() {
        // Get only users (not admins) for customer management
        List<User> users = userRepo.findAll().stream()
                .filter(user -> user.getRole() == UserRole.USER)
                .toList();
        List<UserDto> userDtos = users.stream()
                .map(entityDtoMapper::mapUserToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .userList(userDtos)
                .build();
    }

    @Override
    public Response getAllAdmins() {
        // Get all admins (both ADMIN and NORMAL_ADMIN) for admin account management
        List<User> admins = userRepo.findAll().stream()
                .filter(user -> user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.NORMAL_ADMIN)
                .toList();
        List<UserDto> adminDtos = admins.stream()
                .map(entityDtoMapper::mapUserToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .userList(adminDtos) // Reuse userList field for adminList
                .build();
    }

    @Override
    public User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String  email = authentication.getName();
        log.info("User Email is: " + email);
        return userRepo.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User Not found"));
    }

    @Override
    public Response getUserInfoAndOrderHistory() {
        User user = getLoginUser();
        UserDto userDto = entityDtoMapper.mapUserToDtoPlusAddressAndOrderHistory(user);

        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }

    @Override
    public Response createNormalAdmin(UserDto adminDto) {
        // Only ADMIN can create NORMAL_ADMIN
        User currentUser = getLoginUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new InvalidCredentialsException("Only ADMIN can create NORMAL_ADMIN accounts");
        }

        if (userRepo.findByEmail(adminDto.getEmail()).isPresent()) {
            throw new InvalidCredentialsException("Email already exists");
        }

        // Validate password strength
        if (!PasswordValidator.isValid(adminDto.getPassword())) {
            throw new InvalidCredentialsException(PasswordValidator.getPasswordRequirements());
        }

        User normalAdmin = User.builder()
                .name(adminDto.getName())
                .email(adminDto.getEmail())
                .password(passwordEncoder.encode(adminDto.getPassword()))
                .phoneNumber(adminDto.getPhoneNumber())
                .role(UserRole.NORMAL_ADMIN)
                .build();

        User savedAdmin = userRepo.save(normalAdmin);
        UserDto adminDtoResponse = entityDtoMapper.mapUserToDtoBasic(savedAdmin);

        return Response.builder()
                .status(200)
                .message("Normal admin created successfully")
                .user(adminDtoResponse)
                .build();
    }

    @Override
    public Response updateNormalAdmin(Long adminId, UserDto adminDto) {
        // Only ADMIN can update NORMAL_ADMIN
        User currentUser = getLoginUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new InvalidCredentialsException("Only ADMIN can update NORMAL_ADMIN accounts");
        }

        User normalAdmin = userRepo.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found"));

        // Only allow updating NORMAL_ADMIN, not ADMIN
        if (normalAdmin.getRole() != UserRole.NORMAL_ADMIN) {
            throw new InvalidCredentialsException("Cannot update ADMIN account");
        }

        // Check if email is being changed and if it already exists
        if (!normalAdmin.getEmail().equals(adminDto.getEmail()) && 
            userRepo.findByEmail(adminDto.getEmail()).isPresent()) {
            throw new InvalidCredentialsException("Email already exists");
        }

        normalAdmin.setName(adminDto.getName());
        normalAdmin.setEmail(adminDto.getEmail());
        normalAdmin.setPhoneNumber(adminDto.getPhoneNumber());

        User updatedAdmin = userRepo.save(normalAdmin);
        UserDto adminDtoResponse = entityDtoMapper.mapUserToDtoBasic(updatedAdmin);

        return Response.builder()
                .status(200)
                .message("Normal admin updated successfully")
                .user(adminDtoResponse)
                .build();
    }

    @Override
    public Response deleteNormalAdmin(Long adminId) {
        // Only ADMIN can delete NORMAL_ADMIN
        User currentUser = getLoginUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new InvalidCredentialsException("Only ADMIN can delete NORMAL_ADMIN accounts");
        }

        User normalAdmin = userRepo.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found"));

        // Only allow deleting NORMAL_ADMIN, not ADMIN
        if (normalAdmin.getRole() != UserRole.NORMAL_ADMIN) {
            throw new InvalidCredentialsException("Cannot delete ADMIN account");
        }

        userRepo.delete(normalAdmin);

        return Response.builder()
                .status(200)
                .message("Normal admin deleted successfully")
                .build();
    }

    @Override
    public Response changeNormalAdminPassword(Long adminId, String oldPassword, String newPassword) {
        // Only ADMIN can change NORMAL_ADMIN password
        User currentUser = getLoginUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new InvalidCredentialsException("Only ADMIN can change NORMAL_ADMIN passwords");
        }

        User normalAdmin = userRepo.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found"));

        // Only allow changing password for NORMAL_ADMIN, not ADMIN
        if (normalAdmin.getRole() != UserRole.NORMAL_ADMIN) {
            throw new InvalidCredentialsException("Cannot change ADMIN password");
        }

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, normalAdmin.getPassword())) {
            throw new InvalidCredentialsException("Old password does not match");
        }

        // Validate password strength
        if (!PasswordValidator.isValid(newPassword)) {
            throw new InvalidCredentialsException(PasswordValidator.getPasswordRequirements());
        }

        normalAdmin.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(normalAdmin);

        return Response.builder()
                .status(200)
                .message("Password changed successfully")
                .build();
    }

    @Override
    public Response forgotPassword(ForgotPasswordRequest request) {
        // Check if email exists
        User user = userRepo.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            // Return success message even if email doesn't exist (security best practice)
            // But we'll indicate that they should register
            return Response.builder()
                    .status(200)
                    .message("Email not found. Please register a new account.")
                    .build();
        }

        // Delete any existing reset tokens for this user
        passwordResetTokenRepo.deleteByUserEmail(user.getEmail());

        // Generate reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        passwordResetTokenRepo.save(resetToken);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return Response.builder()
                .status(200)
                .message("Password reset email has been sent to your email address")
                .build();
    }

    @Override
    public Response resetPassword(ResetPasswordRequest request) {
        // Find token
        PasswordResetToken resetToken = passwordResetTokenRepo.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired reset token"));

        // Check if token is already used
        if (resetToken.isUsed()) {
            throw new InvalidCredentialsException("This reset token has already been used");
        }

        // Check if token is expired
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Reset token has expired. Please request a new one.");
        }

        // Validate password strength
        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new InvalidCredentialsException(PasswordValidator.getPasswordRequirements());
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepo.save(resetToken);

        return Response.builder()
                .status(200)
                .message("Password has been reset successfully")
                .build();
    }
}