package org.example.service.interf;

import org.example.dto.ForgotPasswordRequest;
import org.example.dto.LoginRequest;
import org.example.dto.ResetPasswordRequest;
import org.example.dto.Response;
import org.example.dto.UserDto;
import org.example.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    Response getAllAdmins();
    User getLoginUser();
    Response getUserInfoAndOrderHistory();
    Response createNormalAdmin(UserDto adminDto);
    Response updateNormalAdmin(Long adminId, UserDto adminDto);
    Response deleteNormalAdmin(Long adminId);
    Response changeNormalAdminPassword(Long adminId, String oldPassword, String newPassword);
    Response forgotPassword(ForgotPasswordRequest request);
    Response resetPassword(ResetPasswordRequest request);
}