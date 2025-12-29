import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [passwordStrength, setPasswordStrength] = useState('');

    useEffect(() => {
        if (!token) {
            setMessage("Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.");
            setMessageType('error');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'password') {
            validatePasswordStrength(value);
        }
    }

    const validatePasswordStrength = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        const hasMinLength = password.length >= 8;

        const requirements = [];
        if (!hasMinLength) requirements.push("ít nhất 8 ký tự");
        if (!hasUpperCase) requirements.push("chữ hoa");
        if (!hasLowerCase) requirements.push("chữ thường");
        if (!hasNumber) requirements.push("số");
        if (!hasSpecialChar) requirements.push("ký tự đặc biệt (@$!%*?&)");

        if (requirements.length === 0) {
            setPasswordStrength('');
        } else {
            setPasswordStrength(`Mật khẩu cần có: ${requirements.join(', ')}`);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setMessage("Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.");
            setMessageType('error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp!");
            setMessageType('error');
            return;
        }

        if (passwordStrength) {
            setMessage(passwordStrength);
            setMessageType('error');
            return;
        }

        try {
            const response = await ApiService.resetPassword({
                token: token,
                password: formData.password
            });
            if (response.status === 200) {
                setMessage("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...");
                setMessageType('success');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Đặt lại mật khẩu thất bại");
            setMessageType('error');
        }
    }

    return (
        <div className="register-page">
            <h2>Đặt lại mật khẩu</h2>
            {message && (
                <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
                    <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>Mật khẩu mới: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                    required />
                {passwordStrength && (
                    <div className="error-message" style={{marginTop: '-15px', marginBottom: '15px'}}>
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{passwordStrength}</span>
                    </div>
                )}

                <label>Xác nhận mật khẩu: </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu mới"
                    required />

                <div className="password-requirements">
                    <strong>Yêu cầu mật khẩu:</strong>
                    <ul>
                        <li>Ít nhất 8 ký tự</li>
                        <li>Có chữ hoa và chữ thường</li>
                        <li>Có số</li>
                        <li>Có ký tự đặc biệt (@$!%*?&)</li>
                    </ul>
                </div>

                <button type="submit" className="btn btn-primary">Đặt lại mật khẩu</button>
                
                <p className="register-link">
                    <a href="/login">Quay lại đăng nhập</a>
                </p>
            </form>
        </div>
    )
}

export default ResetPasswordPage;

