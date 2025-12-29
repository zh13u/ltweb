import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.createCategory({name});
            if (response.status === 200) {
                setMessage(response.message || "Thêm danh mục thành công!");
                setMessageType('success');
                setTimeout(()=>{
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Thêm danh mục thất bại");
            setMessageType('error');
        }
    }

    return(
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Thêm danh mục</h1>
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
                            onChange={(e)=> setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/categories")}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-plus"></i>
                            Thêm danh mục
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCategory;