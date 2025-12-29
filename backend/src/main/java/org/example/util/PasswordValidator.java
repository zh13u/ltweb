package org.example.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    
    // Mật khẩu mạnh: ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    
    public static boolean isValid(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        return pattern.matcher(password).matches();
    }
    
    public static String getPasswordRequirements() {
        return "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)";
    }
}

