import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const PaymentPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(location.state?.totalPrice || 0);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!ApiService.isAuthenticated()) {
      setMessage("Bạn cần đăng nhập để thanh toán");
      setMessageType('error');
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      const paymentRequest = {
        orderId: parseInt(orderId),
        amount: totalPrice,
        method: paymentMethod
      };

      const response = await ApiService.processPayment(paymentRequest);
      
      if (response.status === 200) {
        setMessage(response.message || "Thanh toán thành công!");
        setMessageType('success');
        setTimeout(() => {
          navigate("/my-orders");
        }, 2000);
      } else {
        setMessage(response.message || "Thanh toán thất bại");
        setMessageType('error');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Thanh toán thất bại"
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Thanh toán đơn hàng</h1>
          <button className="btn btn-outline" onClick={() => navigate("/my-orders")}>
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

        <div style={{ maxWidth: '600px', margin: '2rem auto', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Thông tin thanh toán</h2>
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem' }}>
              <p><strong>Mã đơn hàng:</strong> #{orderId}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb', marginTop: '0.5rem' }}>
                Tổng tiền: {formatCurrency(totalPrice)}
              </p>
            </div>
          </div>

          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label>Phương thức thanh toán *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}
              >
                <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                <option value="CASH">Tiền mặt</option>
                <option value="CREDIT_CARD">Thẻ tín dụng</option>
                <option value="E_WALLET">Ví điện tử</option>
              </select>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate("/my-orders")}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card"></i>
                    Xác nhận thanh toán
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

