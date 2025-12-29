import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const AdminRevenuePage = () => {
  const [revenueStats, setRevenueStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all"); // 'today', 'week', 'month', 'all'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);
      // Fetch revenue stats from Payment API
      const todayResponse = await ApiService.getRevenueStats('day');
      const weekResponse = await ApiService.getRevenueStats('week');
      const monthResponse = await ApiService.getRevenueStats('month');

      setRevenueStats({
        today: todayResponse.revenue || 0,
        thisWeek: weekResponse.revenue || 0,
        thisMonth: monthResponse.revenue || 0,
      });
      setError(null);
    } catch (error) {
      console.log("Error fetching revenue stats", error);
      setError(error.response?.data?.message || "Không thể tải thống kê doanh thu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <Loading message="Đang tải thống kê doanh thu..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Thống kê doanh thu</h1>
            <p>Xem thống kê doanh thu theo ngày, tuần và tháng</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/admin")}>
            <i className="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="revenue-stats-grid">
          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: "#3b82f6" }}>
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="revenue-content">
              <h3>Doanh thu hôm nay</h3>
              <p className="revenue-amount">{formatCurrency(revenueStats.today)}</p>
              <span className="revenue-label">Tổng đơn hàng trong ngày</span>
            </div>
          </div>

          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: "#10b981" }}>
              <i className="fas fa-calendar-week"></i>
            </div>
            <div className="revenue-content">
              <h3>Doanh thu tuần này</h3>
              <p className="revenue-amount">{formatCurrency(revenueStats.thisWeek)}</p>
              <span className="revenue-label">7 ngày qua</span>
            </div>
          </div>

          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: "#f59e0b" }}>
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="revenue-content">
              <h3>Doanh thu tháng này</h3>
              <p className="revenue-amount">{formatCurrency(revenueStats.thisMonth)}</p>
              <span className="revenue-label">Tháng hiện tại</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;

