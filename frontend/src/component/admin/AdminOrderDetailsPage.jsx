import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";


const OrderStatus = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "PAID", label: "Đã thanh toán" }
];

const getStatusLabel = (status) => {
    const statusMap = {
        'PENDING': 'Chờ xác nhận',
        'APPROVED': 'Đã duyệt',
        'REJECTED': 'Đã từ chối',
        'CANCELLED': 'Đã hủy',
        'PAID': 'Đã thanh toán'
    };
    return statusMap[status] || status;
};

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');


    useEffect(() => {
        // itemId is actually orderId
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (orderId) => {
        try {
            setLoading(true);
            const response = await ApiService.getOrderById(orderId);
            setOrder(response.order);
            setSelectedStatus(response.order?.status || 'PENDING');
        } catch (error) {
            console.log(error.message || error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    }

    const handleSubmitStatusChange = async () => {
        if (!order) return;
        
        try {
            setLoading(true);
            const orderId = order.id;
            let response;
            if (selectedStatus === 'APPROVED') {
                response = await ApiService.approveOrder(orderId);
            } else if (selectedStatus === 'REJECTED') {
                response = await ApiService.rejectOrder(orderId);
            } else if (selectedStatus === 'CANCELLED') {
                response = await ApiService.cancelOrder(orderId);
            } else {
                response = await ApiService.updateOrderStatus(orderId, selectedStatus);
            }
            setMessage(response.message || 'Cập nhật trạng thái đơn hàng thành công!');
            setMessageType('success');
            // Refresh data immediately
            await fetchOrderDetails(orderId);
            setTimeout(() => {
                setMessage('');
            }, 3000)
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Cập nhật trạng thái đơn hàng thất bại');
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container">
                    <Loading message="Đang tải chi tiết đơn hàng..." />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Chi tiết đơn hàng</h1>
                    <button className="btn btn-outline" onClick={() => navigate("/admin/orders")}>
                        <i className="fas fa-arrow-left"></i>
                        Quay lại
                    </button>
                </div>

                {message && (
                    <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
                        <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        {message}
                    </div>
                )}

                {!order ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                        <i className="fas fa-box" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                        <h3>Không tìm thấy đơn hàng</h3>
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', marginTop: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        {/* Order Info */}
                        <div className="section" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Thông tin đơn hàng</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div><strong>Mã đơn hàng:</strong> #{order.id}</div>
                                <div><strong>Tổng giá đơn:</strong> {formatCurrency(order.totalPrice || 0)}</div>
                                <div><strong>Trạng thái đơn:</strong> <span className="status-badge">{getStatusLabel(order.status)}</span></div>
                                <div>
                                    <strong>Ngày đặt:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </div>
                            </div>
                        </div>
                        
                        {/* Order Items */}
                        {order.orderItemList && order.orderItemList.length > 0 ? (
                            <div className="section" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Danh sách sản phẩm trong đơn</h2>
                                {order.orderItemList.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                        <img src={item.product?.imageUrl} alt={item.product?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4>{item.product?.name}</h4>
                                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.product?.description}</p>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                                <span>Số lượng: {item.quantity}</span>
                                                <span style={{ fontWeight: '600', color: '#2563eb' }}>
                                                    {formatCurrency(item.price || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="section" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                                <p style={{ color: '#64748b' }}>Không có sản phẩm nào trong đơn hàng này.</p>
                            </div>
                        )}

                        {/* User Info */}
                        {order.orderItemList && order.orderItemList.length > 0 && order.orderItemList[0]?.user && (
                            <>
                                <div className="section" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Thông tin khách hàng</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div><strong>Tên:</strong> {order.orderItemList[0].user?.name || 'N/A'}</div>
                                        <div><strong>Email:</strong> {order.orderItemList[0].user?.email || 'N/A'}</div>
                                        <div><strong>SĐT:</strong> {order.orderItemList[0].user?.phoneNumber || 'N/A'}</div>
                                        <div><strong>Vai trò:</strong> {order.orderItemList[0].user?.role || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                {order.orderItemList[0].user?.address && (
                                    <div className="section" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Địa chỉ giao hàng</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            <div><strong>Quốc gia:</strong> {order.orderItemList[0].user.address.country || 'N/A'}</div>
                                            <div><strong>Tỉnh/Thành:</strong> {order.orderItemList[0].user.address.state || 'N/A'}</div>
                                            <div><strong>Thành phố:</strong> {order.orderItemList[0].user.address.city || 'N/A'}</div>
                                            <div><strong>Đường:</strong> {order.orderItemList[0].user.address.street || 'N/A'}</div>
                                            <div><strong>Mã bưu điện:</strong> {order.orderItemList[0].user.address.zipCode || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Status Control */}
                        <div className="section">
                            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Cập nhật trạng thái đơn hàng</h2>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    style={{ padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', minWidth: '200px' }}
                                >
                                    {OrderStatus.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn btn-primary" onClick={handleSubmitStatusChange}>
                                    <i className="fas fa-save"></i>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default AdminOrderDetailsPage;