import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/editProduct.css";
import ApiService from "../../service/ApiService";

const EditProductPage = () => {
  const { productId } = useParams();
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState('success');
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getAllCategory().then((res) => setCategories(res.categoryList));

    if (productId) {
      ApiService.getProductById(productId).then((response) => {
        setName(response.product.name);
        setDescription(response.product.description);
        setPrice(response.product.price);
        setCategoryId(response.product.categoryId);
        setImageUrl(response.product.imageUrl);
      });
    }
  }, [productId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("productId", productId);
      formData.append("categoryId", categoryId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      const response = await ApiService.updateProduct(formData);
      if (response.status === 200) {
        setMessage(response.message || "Cập nhật sản phẩm thành công!");
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
          "Cập nhật sản phẩm thất bại"
      );
      setMessageType('error');
    }
  };

  return (
    <div className="luxury-container">
      <div className="luxury-card">
        <h2 className="luxury-title">Chỉnh sửa sản phẩm</h2>
        {message && (
          <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        <div className="luxury-grid">
          {/* Left: Image Preview */}
          <div className="luxury-image-section">
            <div className="img-wrapper">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="luxury-img" />
              ) : (
                <div className="img-placeholder">No Image</div>
              )}
            </div>
            <label className="btn-upload">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Right: Form Fields */}
          <form onSubmit={handleSubmit} className="luxury-form">
            <div className="field-group">
              <label>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
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
                placeholder="Describe your product"
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
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
