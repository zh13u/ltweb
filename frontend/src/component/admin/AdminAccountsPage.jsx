import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Loading from "../common/Loading";

const AdminAccountsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordModalMessage, setPasswordModalMessage] = useState(null);
  const [passwordModalMessageType, setPasswordModalMessageType] = useState('error');
  const navigate = useNavigate();

  useEffect(() => {
    // Only ADMIN can access this page
    if (!ApiService.isSuperAdmin()) {
      navigate("/admin");
      return;
    }
    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllAdmins();
      setAdmins(response.userList || []);
      setError(null);
    } catch (error) {
      console.log("Error fetching admins", error);
      setError(error.response?.data?.message || "Không thể tải danh sách admin");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phoneNumber: ""
    });
    setSelectedAdmin(null);
    setShowAddModal(true);
  };

  const handleEdit = (admin) => {
    // Only allow editing NORMAL_ADMIN
    if (admin.role === 'ADMIN') {
      setMessage("Không thể chỉnh sửa tài khoản ADMIN");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      phoneNumber: admin.phoneNumber || ""
    });
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = async (admin) => {
    // Only allow deleting NORMAL_ADMIN
    if (admin.role === 'ADMIN') {
      setMessage("Không thể xóa tài khoản ADMIN");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa admin "${admin.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await ApiService.deleteNormalAdmin(admin.id);
      setMessage("Xóa admin thành công!");
      setMessageType('success');
      fetchAdmins();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Xóa admin thất bại");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (admin) => {
    // Only allow changing password for NORMAL_ADMIN
    if (admin.role === 'ADMIN') {
      setMessage("Không thể đổi mật khẩu tài khoản ADMIN");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordModalMessage(null);
    setSelectedAdmin(admin);
    setShowPasswordModal(true);
  };

  const handleSaveAdmin = async () => {
    try {
      setLoading(true);
      if (showAddModal) {
        // Validate
        if (!formData.name || !formData.email || !formData.password) {
          setMessage("Vui lòng điền đầy đủ thông tin");
          setMessageType('error');
          setTimeout(() => setMessage(null), 3000);
          return;
        }
        if (!validatePasswordStrength(formData.password)) {
          setMessage("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)");
          setMessageType('error');
          setTimeout(() => setMessage(null), 3000);
          return;
        }
        await ApiService.createNormalAdmin(formData);
        setMessage("Thêm admin thành công!");
      } else {
        // Validate
        if (!formData.name || !formData.email) {
          setMessage("Vui lòng điền đầy đủ thông tin");
          setMessageType('error');
          setTimeout(() => setMessage(null), 3000);
          setLoading(false);
          return;
        }
        // Remove password from update data (password is changed via separate modal)
        const updateData = { ...formData };
        delete updateData.password;
        await ApiService.updateNormalAdmin(selectedAdmin.id, updateData);
        setMessage("Cập nhật admin thành công!");
      }
      setMessageType('success');
      setShowAddModal(false);
      setShowEditModal(false);
      fetchAdmins();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Thao tác thất bại");
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  };

  const handleSavePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordModalMessage("Mật khẩu mới không khớp");
        setPasswordModalMessageType('error');
        setTimeout(() => setPasswordModalMessage(null), 5000);
        return;
      }
      if (!validatePasswordStrength(passwordData.newPassword)) {
        setPasswordModalMessage("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)");
        setPasswordModalMessageType('error');
        setTimeout(() => setPasswordModalMessage(null), 5000);
        return;
      }
      setLoading(true);
      setPasswordModalMessage(null);
      await ApiService.changeNormalAdminPassword(
        selectedAdmin.id,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      setPasswordModalMessage("Đổi mật khẩu thành công!");
      setPasswordModalMessageType('success');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordModalMessage(null);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }, 1500);
    } catch (error) {
      setPasswordModalMessage(error.response?.data?.message || "Đổi mật khẩu thất bại");
      setPasswordModalMessageType('error');
      setTimeout(() => setPasswordModalMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'ADMIN') return 'Admin (Mặc định)';
    if (role === 'NORMAL_ADMIN') return 'Admin thường';
    return role;
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && admins.length === 0) {
    return (
      <div className="admin-page">
        <div className="container">
          <Loading message="Đang tải danh sách admin..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Quản lý tài khoản admin</h1>
            <p>Quản lý các tài khoản được phép truy cập trang quản trị</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/admin")}>
            <i className="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>

        {message && (
          <div className={messageType === "error" ? "error-message" : "success-message"}>
            <i className={`fas ${messageType === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
            {message}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="accounts-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="search-box" style={{ maxWidth: "400px", flex: 1 }}>
            <input
              type="text"
              placeholder="Tìm kiếm admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Thêm admin
          </button>
        </div>

        <div className="table-container" style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div className="table-header" style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 2fr',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            <div className="table-cell">Tài khoản</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Số điện thoại</div>
            <div className="table-cell">Vai trò</div>
            <div className="table-cell">Thao tác</div>
          </div>

          {filteredAdmins.length === 0 ? (
            <div className="no-admins" style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              color: '#64748b', 
              gridColumn: '1 / -1',
              background: '#f9fafb'
            }}>
              <i className="fas fa-user-shield" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <h3 style={{ margin: 0, fontWeight: 500 }}>Không tìm thấy admin nào</h3>
            </div>
          ) : (
            filteredAdmins.map((admin, index) => (
              <div key={admin.id} className="table-row" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 2fr',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                borderBottom: index < filteredAdmins.length - 1 ? '1px solid #e5e7eb' : 'none',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                <div className="table-cell">
                  <div className="admin-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="admin-avatar" style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="admin-details">
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{admin.name}</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>ID: #{admin.id}</p>
                    </div>
                  </div>
                </div>
                <div className="table-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#374151', fontSize: '0.95rem' }}>{admin.email}</span>
                </div>
                <div className="table-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#374151', fontSize: '0.95rem' }}>{admin.phoneNumber || 'N/A'}</span>
                </div>
                <div className="table-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`role-badge ${admin.role === 'ADMIN' ? 'admin-default' : ''}`} style={{
                    display: 'inline-block',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: admin.role === 'ADMIN' ? '#fef3c7' : '#dbeafe',
                    color: admin.role === 'ADMIN' ? '#92400e' : '#1e40af'
                  }}>
                    {getRoleLabel(admin.role)}
                  </span>
                </div>
                <div className="table-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {admin.role === 'NORMAL_ADMIN' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(admin)} title="Chỉnh sửa" style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: 'white',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.color = '#667eea';
                          e.target.style.background = '#f0f4ff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.color = '#374151';
                          e.target.style.background = 'white';
                        }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleChangePassword(admin)} title="Đổi mật khẩu" style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: 'white',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#10b981';
                          e.target.style.color = '#10b981';
                          e.target.style.background = '#f0fdf4';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.color = '#374151';
                          e.target.style.background = 'white';
                        }}>
                          <i className="fas fa-key"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin)} title="Xóa" style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #fee2e2',
                          borderRadius: '6px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fef2f2';
                          e.target.style.borderColor = '#fee2e2';
                        }}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </>
                    )}
                    {admin.role === 'ADMIN' && (
                      <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>Không thể chỉnh sửa</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div className="modal-header" style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px 16px 0 0',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Thêm admin mới</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Tên admin <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên admin"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Mật khẩu <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{fontSize: '0.85em', color: '#666', marginTop: '8px'}}>
                  <strong>Yêu cầu mật khẩu:</strong>
                  <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
                    <li>Ít nhất 8 ký tự</li>
                    <li>Có chữ hoa và chữ thường</li>
                    <li>Có số</li>
                    <li>Có ký tự đặc biệt (@$!%*?&)</li>
                  </ul>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            <div className="modal-footer" style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              background: '#f9fafb',
              borderRadius: '0 0 16px 16px'
            }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)} style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = 'white';
              }}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSaveAdmin} style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div className="modal-header" style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px 16px 0 0',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Chỉnh sửa admin</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Tên admin <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên admin"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            <div className="modal-footer" style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              background: '#f9fafb',
              borderRadius: '0 0 16px 16px'
            }}>
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)} style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = 'white';
              }}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSaveAdmin} style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div className="modal-header" style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px 16px 0 0',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Đổi mật khẩu</h2>
              <button className="close-btn" onClick={() => {
                setShowPasswordModal(false);
                setPasswordModalMessage(null);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
              }} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              {passwordModalMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  backgroundColor: passwordModalMessageType === 'error' ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${passwordModalMessageType === 'error' ? '#fecaca' : '#bbf7d0'}`,
                  color: passwordModalMessageType === 'error' ? '#dc2626' : '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <i className={`fas ${passwordModalMessageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                  <span>{passwordModalMessage}</span>
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Mật khẩu cũ <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Nhập mật khẩu cũ"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{fontSize: '0.85em', color: '#666', marginTop: '8px'}}>
                  <strong>Yêu cầu mật khẩu:</strong>
                  <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
                    <li>Ít nhất 8 ký tự</li>
                    <li>Có chữ hoa và chữ thường</li>
                    <li>Có số</li>
                    <li>Có ký tự đặc biệt (@$!%*?&)</li>
                  </ul>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Xác nhận mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Xác nhận mật khẩu mới"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            <div className="modal-footer" style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              background: '#f9fafb',
              borderRadius: '0 0 16px 16px'
            }}>
              <button className="btn btn-outline" onClick={() => {
                setShowPasswordModal(false);
                setPasswordModalMessage(null);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
              }} style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = 'white';
              }}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSavePassword} style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }}>
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
