import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllCustomers();
      setCustomers(response.userList || []);
      setError(null);
    } catch (error) {
      console.log("Error fetching customers", error);
      setError(error.response?.data?.message || "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <Loading message="Đang tải danh sách khách hàng..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Quản lý khách hàng</h1>
            <p>Xem thông tin khách hàng của cửa hàng</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/admin")}>
            <i className="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="customers-header">
          <div className="search-box" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="customers-summary">
            <div className="summary-item">
              <span>Tổng khách hàng:</span>
              <strong>{customers.length}</strong>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="table-cell">Khách hàng</div>
            <div className="table-cell">Thông tin liên hệ</div>
            <div className="table-cell">Ngày tham gia</div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="no-customers">
              <i className="fas fa-users"></i>
              <h3>Không tìm thấy khách hàng nào</h3>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="table-row">
                <div className="table-cell">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="customer-details">
                      <h4>{customer.name}</h4>
                      <p>ID: #{customer.id}</p>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{customer.email}</span>
                    </div>
                    {customer.phoneNumber && (
                      <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span>{customer.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="table-cell">
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;

