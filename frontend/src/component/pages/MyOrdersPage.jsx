import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const MyOrdersPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING'); // Default to PENDING
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Clear orders immediately when filter changes to prevent showing stale data
    setOrders([]);
    
    // Filter orders by status
    let filtered = allOrders;
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = allOrders.filter(order => order.status === statusFilter);
    }
    // Sort by createdAt ASC (oldest first)
    filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setOrders(filtered);
  }, [statusFilter, allOrders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserOrders();
      // Group order items by order
      const orderMap = new Map();
      response.orderItemList?.forEach((item) => {
        const orderId = item.order?.id || 'unknown';
        if (!orderMap.has(orderId)) {
          const orderStatus = item.order?.status || 'PENDING';
          orderMap.set(orderId, {
            orderId: orderId,
            totalPrice: item.order?.totalPrice || 0,
            createdAt: item.order?.createdAt || item.createdAt,
            items: [],
            status: orderStatus,
            canPay: orderStatus === 'APPROVED',
            canCancel: orderStatus === 'PENDING'
          });
        }
        orderMap.get(orderId).items.push(item);
      });
      // Get all orders (filtering will be done in useEffect)
      const allOrdersList = Array.from(orderMap.values());
      setAllOrders(allOrdersList);
      setError(null);
    } catch (error) {
      console.log("Error fetching orders", error);
      setError(error.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }
    try {
      setLoading(true);
      const response = await ApiService.cancelOrder(orderId);
      setMessage(response.message || "Hủy đơn hàng thành công!");
      setMessageType('success');
      await fetchOrders();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Hủy đơn hàng thất bại");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (orderId, totalPrice) => {
    navigate(`/payment/${orderId}`, { state: { totalPrice } });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-badge';
      case 'APPROVED':
        return 'status-badge active';
      case 'REJECTED':
        return 'status-badge inactive';
      case 'PAID':
        return 'status-badge active';
      case 'CANCELLED':
        return 'status-badge inactive';
      default:
        return 'status-badge';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xác nhận',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Đã từ chối',
      'PAID': 'Đã thanh toán',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <Loading message="Đang tải danh sách đơn hàng..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Đơn hàng của tôi</h1>
            <p>Xem và quản lý đơn hàng của bạn</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/")}>
            <i className="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>

        {message && (
          <div className={messageType === "error" ? "error-message" : "success-message"}>
            <i className={`fas ${messageType === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
            {message}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="form-group" style={{ minWidth: '200px' }}>
            <label>Lọc theo trạng thái:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', width: '100%' }}
            >
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>

        {allOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <h3>Bạn chưa có đơn hàng nào</h3>
            <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: '1rem' }}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <i className="fas fa-filter" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <h3>Không có đơn hàng nào với trạng thái "{getStatusLabel(statusFilter)}"</h3>
            <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Thử chọn trạng thái khác</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
            {orders.map((order) => (
              <div key={order.orderId} style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3>Đơn hàng #{order.orderId}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className={getStatusBadgeClass(order.status)}>
                      {getStatusLabel(order.status)}
                    </span>
                    {order.canPay && (
                      <button className="btn btn-primary" onClick={() => handlePayment(order.orderId, order.totalPrice)}>
                        <i className="fas fa-credit-card"></i>
                        Thanh toán
                      </button>
                    )}
                    {order.canCancel && (
                      <button className="btn btn-danger" onClick={() => handleCancelOrder(order.orderId)}>
                        <i className="fas fa-times"></i>
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
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

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tổng cộng:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2563eb' }}>
                    {formatCurrency(order.totalPrice || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;

