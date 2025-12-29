import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>PhoneStore</h3>
                        <p>Cửa hàng điện thoại uy tín với hơn 10 năm kinh nghiệm.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href="#" aria-label="TikTok">
                                <i className="fab fa-tiktok"></i>
                            </a>
                        </div>
                        <div className="footer-cta">
                            <NavLink className="footer-btn" to="/">
                                <i className="fas fa-headset" />
                                Nhận tư vấn
                            </NavLink>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Sản phẩm</h4>
                        <ul>
                            <li>
                                <NavLink to="/categories">
                                    <i className="fas fa-mobile-alt" /> Điện thoại
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/categories">
                                    <i className="fas fa-bolt" /> Phụ kiện
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Hỗ trợ</h4>
                        <ul>
                            <li>
                                <NavLink to="/">
                                    <i className="fas fa-shield-alt" /> Chính sách bảo hành
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/">
                                    <i className="fas fa-shopping-bag" /> Hướng dẫn mua hàng
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/">
                                    <i className="fas fa-truck" /> Giao hàng & thanh toán
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/">
                                    <i className="fas fa-undo" /> Đổi trả sản phẩm
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Liên hệ</h4>
                        <ul>
                            <li>
                                <i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận 1, TP.HCM
                            </li>
                            <li>
                                <i className="fas fa-phone"></i> 1900 1234
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i> info@phonestore.com
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 PhoneStore. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;