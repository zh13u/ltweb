import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import "../../style/adminCategory.css";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategory();
      setCategories(response.categoryList || []);
    } catch (error) {
      console.log("Error fetching category list", error);
    }
  };

  const handleEdit = async (id) => {
    navigate(`/admin/edit-category/${id}`);
  };
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?"
    );
    if (confirmed) {
      try {
        await ApiService.deleteCategory(id);
        setMessage("Xóa danh mục thành công!");
        setMessageType('success');
        fetchCategories();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || "Xóa danh mục thất bại");
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
            <h1>Quản lý danh mục</h1>
            <p>Thêm, sửa, xóa danh mục sản phẩm</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/add-category")}
          >
            <i className="fas fa-plus"></i>
            Thêm danh mục
          </button>
        </div>

        {message && (
          <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        <div className="admin-grid" style={{ marginTop: '2rem' }}>

          {categories.map((cat) => (
            <div className="admin-card" key={cat.id}>
              <i className="fas fa-folder" style={{ fontSize: '2.5rem', color: '#2563eb', marginBottom: '1rem' }}></i>
              <h3>{cat.name}</h3>
              <div className="action-buttons" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => handleEdit(cat.id)}
                >
                  <i className="fas fa-edit"></i>
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  <i className="fas fa-trash"></i>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryPage;
