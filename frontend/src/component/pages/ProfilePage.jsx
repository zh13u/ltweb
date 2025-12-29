import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/profile.css";
import Pagination from "../common/Pagination";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getLoggedInUserInfo();
      console.log("Fetched userInfo:", response.user);
      setUserInfo(response.user);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch user info"
      );
    }
  };

  if (!userInfo) {
    return <div className="loading">Loading...</div>;
  }

  const handleAddressClick = () => {
    navigate(userInfo.address ? "/edit-address" : "/add-address");
  };

  const orderItemList = userInfo.orderItemList || [];
  const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
  const paginatedOrders = orderItemList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="profile-page">
      <h1 className="profile-title">Welcome, {userInfo.name}</h1>

      {error && <p className="error-message">{error}</p>}

      {/* ---------- My Information ---------- */}
      <div className="profile-card info-card">
        <h2>My Information</h2>
        <div className="info-list">
          <div className="info-row">
            <div className="info-label">Name:</div>
            <div className="info-value">{userInfo.name}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Email:</div>
            <div className="info-value">{userInfo.email}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Phone:</div>
            <div className="info-value">{userInfo.phoneNumber}</div>
          </div>
        </div>
      </div>

      {/* ---------- Address ---------- */}
      <div className="profile-card address-card">
        <h2>Address</h2>
        {userInfo.address ? (
          <div className="info-list">
            <div className="info-row">
              <div className="info-label">Street:</div>
              <div className="info-value">{userInfo.address.street}</div>
            </div>
            <div className="info-row">
              <div className="info-label">City:</div>
              <div className="info-value">{userInfo.address.city}</div>
            </div>
            <div className="info-row">
              <div className="info-label">State:</div>
              <div className="info-value">{userInfo.address.state}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Zip Code:</div>
              <div className="info-value">{userInfo.address.zipCode}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Country:</div>
              <div className="info-value">{userInfo.address.country}</div>
            </div>
          </div>
        ) : (
          <p className="no-data">No address on file.</p>
        )}
        <button className="profile-button" onClick={handleAddressClick}>
          {userInfo.address ? "Edit Address" : "Add Address"}
        </button>
      </div>

      {/* ---------- Order History ---------- */}
      <div className="profile-card orders-card">
        <h2>Order History</h2>

        {paginatedOrders.length ? (
          <div className="orders-grid">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="order-item">
                <img
                  src={order.product?.imageUrl}
                  alt={order.product?.name}
                  className="order-img"
                />
                <div className="order-info">
                  <h3>Name: {order.product?.name}</h3>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ${order.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">You have no orders yet.</p>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
