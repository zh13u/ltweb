import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";

const CartPage = () => {
  const { cart, dispatch } = useCart();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();

  const increment = (product) => {
    dispatch({ type: "INCREMENT_ITEM", payload: product });
  };

  const decrement = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      dispatch({ type: "DECREMENT_ITEM", payload: product });
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: product });
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!ApiService.isAuthenticated()) {
      setMessage("Bạn cần đăng nhập trước khi đặt hàng");
      setMessageType('error');
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);
      return;
    }

    // Check if user is admin - admins cannot place orders
    if (ApiService.isAdmin()) {
      setMessage("Tài khoản admin không thể đặt hàng");
      setMessageType('error');
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderRequest = {
      totalPrice,
      items: orderItems,
    };

    try {
      const response = await ApiService.createOrder(orderRequest);
      setMessage(response.message || "Đặt hàng thành công! Vui lòng chờ admin xác nhận đơn hàng.");
      setMessageType('success');

      setTimeout(() => {
        setMessage("");
      }, 5000);

      if (response.status === 200) {
        dispatch({ type: "CLEAR_CART" });
        setTimeout(() => {
          navigate("/my-orders");
        }, 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Đặt hàng thất bại"
      );
      setMessageType('error');
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="cart-content">
      <div className="container">
        <div className="cart-container">
          <section className="cart-items">
            <div className="cart-header">
              <h2>Giỏ hàng của bạn</h2>
            </div>
            {message && (
              <div className={messageType === "error" ? "error-message" : "success-message"}>
                <i className={`fas ${messageType === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
                {message}
              </div>
            )}
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-content">
                  <i className="fas fa-shopping-cart"></i>
                  <h3>Giỏ hàng trống</h3>
                  <p>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                </div>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-variant">{item.description}</p>
                      <div className="qty-control">
                        <button onClick={() => decrement(item)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increment(item)}>+</button>
                      </div>
                    </div>
                    <div className="item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <aside className="cart-summary">
              <div className="summary-card">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="summary-line">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="summary-line total">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <button className="btn btn-primary btn-large" onClick={handleCheckout}>
                  <i className="fas fa-shopping-cart"></i>
                  Đặt hàng
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
