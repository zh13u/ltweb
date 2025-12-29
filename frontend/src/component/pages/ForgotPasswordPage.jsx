import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'

const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: ''
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.forgotPassword(formData);
            if (response.status === 200) {
                if (response.message.includes("not found")) {
                    setMessage("Email chưa được đăng ký. Vui lòng đăng ký tài khoản mới.");
                    setMessageType('error');
                    setTimeout(() => {
                        navigate("/register");
                    }, 3000);
                } else {
                    setMessage("Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.");
                    setMessageType('success');
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            setMessageType('error');
        }
    }

    return (
        <div className="register-page">
            <h2>Quên mật khẩu</h2>
            {message && (
                <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
                    <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required />

                <button type="submit" className="btn btn-primary">Gửi email đặt lại mật khẩu</button>
                
                <p className="register-link">
                    Nhớ mật khẩu? <a href="/login">Đăng nhập</a>
                </p>
                <p className="register-link">
                    Chưa có tài khoản? <a href="/register">Đăng ký</a>
                </p>
            </form>
        </div>
    )
}

export default ForgotPasswordPage;

