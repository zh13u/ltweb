import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/addProduct.css";
import ApiService from "../../service/ApiService";

const AddProductPage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState('success');
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ApiService.getAllCategory();
        console.log("Categories response:", res);
        // Đảm bảo categories luôn là array
        if (res && res.categoryList && Array.isArray(res.categoryList)) {
          setCategories(res.categoryList);
        } else {
          console.warn("Invalid categories response format:", res);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        console.error("Error details:", error.response?.data || error.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      const response = await ApiService.addProduct(formData);
      if (response.status === 200) {
        setMessage(response.message || "Thêm sản phẩm thành công!");
        setMessageType('success');
        setTimeout(() => {
          setMessage("");
          navigate("/admin/products");
        }, 3000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Thêm sản phẩm thất bại"
      );
      setMessageType('error');
    }
  };

  return (
    <div className="luxury-container">
      <div className="luxury-card">
        <h2 className="luxury-title">Thêm sản phẩm mới</h2>
        {message && (
          <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        <div className="luxury-grid">
          {/* Left: ảnh / placeholder */}
          <div className="luxury-image-section">
            <div className="img-wrapper">
              {imageUrl ? (
                <img src={imageUrl} alt="preview" className="luxury-img" />
              ) : (
                <div className="img-placeholder">No Image</div>
              )}
            </div>
            <label className="btn-upload">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="luxury-form">
            <div className="field-group">
              <label>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories && Array.isArray(categories) && categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="field-group">
              <label>Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                required
              />
            </div>

            <div className="field-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddProductPage;
