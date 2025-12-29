import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'


const RegisterPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phoneNumber: '',
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
            const response = await ApiService.registerUser(formData);
            if (response.status === 200) {
                setMessage("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
                setMessageType('success');
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            }
        } catch (error) {
            setMessage(error.response?.data.message || error.message || "Đăng ký thất bại");
            setMessageType('error');
        }
    }

    return (
        <div className="register-page">
            <h2>Đăng ký</h2>
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
                    placeholder="Nhập email"
                    required />

                <label>Tên: </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên"
                    required />

                <label>Số điện thoại: </label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    required />

                <label>Mật khẩu: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
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

                    <button type="submit" className="btn btn-primary">Đăng ký</button>
                    <p className="register-link">
                        Đã có tài khoản? <a href="/login">Đăng nhập</a>
                    </p>
            </form>
        </div>
    )
}

export default RegisterPage;