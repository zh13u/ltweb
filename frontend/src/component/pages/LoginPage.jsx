import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'


const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await ApiService.loginUser(formData);
            if (response.status === 200) {
                setMessage("Đăng nhập thành công!");
                setMessageType('success');
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                setTimeout(() => {
                    // Redirect admin to admin page, user to profile
                    if (response.role === 'ADMIN') {
                        navigate("/admin");
                    } else {
                        navigate("/profile");
                    }
                }, 2000)
            }
        } catch (error) {
            setMessage(error.response?.data.message || error.message || "Đăng nhập thất bại");
            setMessageType('error');
        }
    }

    return (
        <div className="register-page">
            <h2>Đăng nhập</h2>
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
                    required />
                    
                <label>Mật khẩu: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required />

                    <button type="submit" className="btn btn-primary">Đăng nhập</button>
                    
                    <p className="register-link">
                        <a href="/forgot-password">Quên mật khẩu?</a>
                    </p>
                    <p className="register-link">
                        Chưa có tài khoản? <a href="/register">Đăng ký</a>
                    </p>
            </form>
        </div>
    )
}

export default LoginPage;