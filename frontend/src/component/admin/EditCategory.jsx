import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../common/Loading";

const EditCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('')
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategory(categoryId);
    }, [categoryId])

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getCategoryById(categoryId);
            setName(response.category.name);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Không thể tải thông tin danh mục");
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
            }, 3000)
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.updateCategory(categoryId, { name });
            if (response.status === 200) {
                setMessage(response.message || "Cập nhật danh mục thành công!");
                setMessageType('success');
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Cập nhật danh mục thất bại");
            setMessageType('error');
        }
    }

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container">
                    <Loading message="Đang tải thông tin danh mục..." />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Chỉnh sửa danh mục</h1>
                    <button className="btn btn-outline" onClick={() => navigate("/admin/categories")}>
                        <i className="fas fa-arrow-left"></i>
                        Quay lại
                    </button>
                </div>
                {message && (
                    <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
                        <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <div className="form-group">
                        <label>Tên danh mục *</label>
                        <input 
                            type="text"
                            placeholder="Nhập tên danh mục"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/categories")}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-save"></i>
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCategory;