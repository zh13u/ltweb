import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [query, setQuery] = useState("");
  const itemsPerPage = 5;

  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const resp = await ApiService.getAllProducts();
      const list = resp.productList || [];
      setProducts(list);
      setFiltered(list);
      setTotalPages(Math.ceil(list.length / itemsPerPage));
      setError(null);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // paginate + filter whenever filtered list or page changes
  const pageItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    const f = products.filter((p) => p.name.toLowerCase().includes(q));
    setFiltered(f);
    setTotalPages(Math.ceil(f.length / itemsPerPage));
    setCurrentPage(1);
  };

  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await ApiService.deleteProduct(id);
        setMessage("Xóa sản phẩm thành công!");
        setMessageType('success');
        fetchProducts();
        setTimeout(() => setMessage(null), 3000);
      } catch (e) {
        setMessage(e.response?.data?.message || e.message || "Xóa sản phẩm thất bại");
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Quản lý sản phẩm</h1>
            <p>Thêm, sửa, xóa sản phẩm</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/add-product")}
          >
            <i className="fas fa-plus"></i>
            Thêm sản phẩm
          </button>
        </div>

        {message && (
          <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="search-box" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChange={handleSearch}
          />
          <i className="fas fa-search"></i>
        </div>

        {loading ? (
          <Loading message="Đang tải danh sách sản phẩm..." />
        ) : (
          <>
            <div className="table-container">
              <div className="table-header">
                <div className="table-cell">Tên sản phẩm</div>
                <div className="table-cell">Giá</div>
                <div className="table-cell">Thao tác</div>
              </div>

              {pageItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', gridColumn: '1 / -1' }}>
                  <i className="fas fa-box" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                  <h3>Không tìm thấy sản phẩm nào</h3>
                </div>
              ) : (
                pageItems.map((p) => (
                  <div key={p.id} className="table-row">
                    <div className="table-cell">{p.name}</div>
                    <div className="table-cell">{formatCurrency(p.price || 0)}</div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p.id)}>
                          <i className="fas fa-edit"></i>
                          Sửa
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                          <i className="fas fa-trash"></i>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductPage;
