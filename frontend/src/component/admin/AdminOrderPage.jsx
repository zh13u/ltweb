import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";


const OrderStatus = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Đã từ chối" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "PAID", label: "Đã thanh toán" }
];

const getStatusLabel = (status) => {
    const statusMap = {
        'PENDING': 'Chờ xác nhận',
        'APPROVED': 'Đã duyệt',
        'REJECTED': 'Đã từ chối',
        'CANCELLED': 'Đã hủy',
        'PAID': 'Đã thanh toán'
    };
    return statusMap[status] || status;
};


const AdminOrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING'); // Default to PENDING
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        // Clear orders immediately when filter changes to prevent showing stale data
        setOrders([]);
        setFilteredOrders([]);
        setCurrentPage(1);
        fetchOrders();
    }, [statusFilter]);

    useEffect(() => {
        // Re-apply filters and pagination when orders, page, or search term changes
        if (orders.length > 0 || searchTerm) {
            applyFiltersAndPagination();
        }
    }, [currentPage, searchTerm, orders]);

    const applyFiltersAndPagination = () => {
        // Apply search filter
        let filtered = orders;
        if (searchTerm) {
            filtered = orders.filter(order => 
                order.orderId.toString().includes(searchTerm) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setTotalPages(Math.ceil(filtered.length/itemsPerPage));
        setFilteredOrders(filtered.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setOrders([]);
            setFilteredOrders([]);
            // Use statusFilter instead of hardcoded PENDING
            const response = await ApiService.getAllOrderItemsByStatus(statusFilter);
            const orderList = response.orderItemList || [];

            // Group by order ID
            const orderMap = new Map();
            orderList.forEach((item) => {
                const orderId = item.order?.id || 'unknown';
                if (!orderMap.has(orderId)) {
                    orderMap.set(orderId, {
                        orderId: orderId,
                        totalPrice: item.order?.totalPrice || 0,
                        createdAt: item.order?.createdAt || item.createdAt,
                        status: item.order?.status || 'PENDING',
                        user: item.user,
                        items: []
                    });
                }
                orderMap.get(orderId).items.push(item);
            });

            // Sort by createdAt ASC (oldest first)
            const groupedOrders = Array.from(orderMap.values())
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            setOrders(groupedOrders);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng')
            setTimeout(()=>{
                setError('')
            }, 3000)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleApprove = async (orderId) => {
        try {
            setLoading(true);
            const response = await ApiService.approveOrder(orderId);
            setMessage(response.message || "Duyệt đơn hàng thành công!");
            setMessageType('success');
            // Reset to page 1 and refresh
            setCurrentPage(1);
            await fetchOrders();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Duyệt đơn hàng thất bại");
            setMessageType('error');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn từ chối đơn hàng này?")) {
            return;
        }
        try {
            setLoading(true);
            const response = await ApiService.rejectOrder(orderId);
            setMessage(response.message || "Từ chối đơn hàng thành công!");
            setMessageType('success');
            // Reset to page 1 and refresh
            setCurrentPage(1);
            await fetchOrders();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Từ chối đơn hàng thất bại");
            setMessageType('error');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };



    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`)
    }


    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Quản lý đơn hàng</h1>
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
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-box" style={{ maxWidth: '400px', flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                    <div className="form-group" style={{ minWidth: '200px' }}>
                        <label>Lọc theo trạng thái:</label>
                        <select 
                            value={statusFilter} 
                            onChange={handleStatusFilterChange}
                            style={{ padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', width: '100%' }}
                        >
                            {OrderStatus.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <Loading message="Đang tải danh sách đơn hàng..." />
                ) : (
                    <>
                        <div className="table-container">
                            <div className="table-header">
                                <div className="table-cell">Mã đơn</div>
                                <div className="table-cell">Khách hàng</div>
                                <div className="table-cell">Trạng thái</div>
                                <div className="table-cell">Giá</div>
                                <div className="table-cell">Ngày đặt</div>
                                <div className="table-cell">Thao tác</div>
                            </div>

                            {filteredOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', gridColumn: '1 / -1' }}>
                                    <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                                    <h3>Không có đơn hàng nào với trạng thái "{getStatusLabel(statusFilter)}"</h3>
                                    <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Thử chọn trạng thái khác hoặc tìm kiếm theo mã đơn hàng</p>
                                </div>
                            ) : (
                                filteredOrders.map(order => (
                                    <div key={order.orderId} className="table-row">
                                        <div className="table-cell">#{order.orderId}</div>
                                        <div className="table-cell">{order.user?.name || 'N/A'}</div>
                                        <div className="table-cell">
                                            <span className="status-badge">{getStatusLabel(order.status)}</span>
                                        </div>
                                        <div className="table-cell">{formatCurrency(order.totalPrice || 0)}</div>
                                        <div className="table-cell">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                        <div className="table-cell">
                                            <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(order.orderId)} title="Duyệt đơn">
                                                            <i className="fas fa-check"></i>
                                                            Duyệt
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(order.orderId)} title="Từ chối đơn">
                                                            <i className="fas fa-times"></i>
                                                            Từ chối
                                                        </button>
                                                    </>
                                                )}
                                                <button className="btn btn-outline btn-sm" onClick={()=> handleOrderDetails(order.orderId)}>
                                                    <i className="fas fa-eye"></i>
                                                    Chi tiết
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
                            onPageChange={(page)=> setCurrentPage(page)}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminOrdersPage;