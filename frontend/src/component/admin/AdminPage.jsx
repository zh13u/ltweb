import React from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AdminPage = () => {
    const navigate = useNavigate();
    const isSuperAdmin = ApiService.isSuperAdmin();

    return(
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Trang quản trị</h1>
                </div>
                <div className="admin-grid">
                    <div className="admin-card" onClick={()=> navigate("/admin/categories")}>
                        <i className="fas fa-folder" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Quản lý danh mục</h3>
                        <p>Thêm, sửa, xóa danh mục sản phẩm</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/categories"); }}>
                            Quản lý
                        </button>
                    </div>
                    <div className="admin-card" onClick={()=> navigate("/admin/products")}>
                        <i className="fas fa-box" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Quản lý sản phẩm</h3>
                        <p>Thêm, sửa, xóa sản phẩm</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/products"); }}>
                            Quản lý
                        </button>
                    </div>
                    <div className="admin-card" onClick={()=> navigate("/admin/orders")}>
                        <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Quản lý đơn hàng</h3>
                        <p>Xem và quản lý đơn hàng</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/orders"); }}>
                            Quản lý
                        </button>
                    </div>
                    <div className="admin-card" onClick={()=> navigate("/admin/customers")}>
                        <i className="fas fa-users" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Quản lý khách hàng</h3>
                        <p>Xem thông tin khách hàng</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/customers"); }}>
                            Xem danh sách
                        </button>
                    </div>
                    <div className="admin-card" onClick={()=> navigate("/admin/revenue")}>
                        <i className="fas fa-chart-line" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Thống kê doanh thu</h3>
                        <p>Xem thống kê doanh thu theo ngày, tuần, tháng</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/revenue"); }}>
                            Xem thống kê
                        </button>
                    </div>
                    <div 
                        className="admin-card" 
                        onClick={()=> isSuperAdmin && navigate("/admin/accounts")}
                        style={!isSuperAdmin ? { 
                            opacity: 0.5, 
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                        } : {}}
                    >
                        <i className="fas fa-user-shield" style={{ fontSize: '3rem', color: '#2563eb', marginBottom: '1rem' }}></i>
                        <h3>Quản lý tài khoản</h3>
                        <p>Quản lý tài khoản admin</p>
                        {isSuperAdmin ? (
                            <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate("/admin/accounts"); }}>
                                Quản lý
                            </button>
                        ) : (
                            <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                Không có quyền
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage;