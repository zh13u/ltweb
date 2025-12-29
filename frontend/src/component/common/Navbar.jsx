import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = ApiService.isAdmin();
  const isAuthenticated = ApiService.isAuthenticated();

  const { cart } = useCart();
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    navigate(`/?search=${searchValue}`);
  };

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout? ");
    if (confirm) {
      ApiService.logout();
      setIsUserMenuOpen(false);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  const getActivePage = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname === "/categories") return "categories";
    if (location.pathname === "/cart") return "cart";
    return "";
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <NavLink to="/">
              <i className="fas fa-mobile-alt"></i>
              <span>PhoneStore</span>
            </NavLink>
          </div>

          {!isAdmin && (
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={`nav-link ${getActivePage() === "home" ? "active" : ""}`}
                >
                  Trang chủ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/categories"
                  className={`nav-link ${getActivePage() === "categories" ? "active" : ""}`}
                >
                  Danh mục
                </NavLink>
              </li>
            </ul>
          )}

          <div className="nav-actions">
            {!isAdmin && (
              <>
                <div className="nav-search">
                  <form className="search-box" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                    <button type="submit" className="search-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                </div>

                <div className="cart-icon">
                  <NavLink
                    to="/cart"
                    title="Giỏ hàng"
                    aria-label="Xem giỏ hàng"
                    className="wishlist-icon"
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {totalItems > 0 && (
                      <span className="wishlist-count">{totalItems}</span>
                    )}
                  </NavLink>
                </div>
              </>
            )}

            <div className="user-dropdown">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className={`user-menu-btn ${isUserMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <i className="fas fa-user"></i>
                    <span>Account</span>
                    <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'rotate' : ''}`}></i>
                  </button>
                  {isUserMenuOpen && (
                    <>
                      <div className="dropdown-overlay" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="dropdown-menu">
                        <NavLink
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <i className="fas fa-user-circle"></i>
                          <span>Hồ sơ</span>
                        </NavLink>
                        {!isAdmin && (
                          <NavLink
                            to="/my-orders"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-shopping-bag"></i>
                            <span>Đơn hàng của tôi</span>
                          </NavLink>
                        )}
                        {isAdmin && (
                          <NavLink
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-tools"></i>
                            <span>Trang quản trị</span>
                          </NavLink>
                        )}
                        <button type="button" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <NavLink to="/login" className="btn btn-outline">
                  <i className="fas fa-user"></i>
                  Đăng nhập
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
