import axios from "axios";

export default class ApiService {

    static BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /**AUTh && USERS API */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data;
    }


    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data;
    }

    static async forgotPassword(emailData) {
        const response = await axios.post(`${this.BASE_URL}/auth/forgot-password`, emailData)
        return response.data;
    }

    static async resetPassword(resetData) {
        const response = await axios.post(`${this.BASE_URL}/auth/reset-password`, resetData)
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }


    /**PRODUCT ENDPOINT */

    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/product/create`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await axios.put(`${this.BASE_URL}/product/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/product/get-all`)
        return response.data;
    }

    static async searchProducts(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/product/search`, {
            params: { searchValue }
        });
        return response.data;
    }

    static async getAllProductsByCategoryId(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-category-id/${categoryId}`)
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-product-id/${productId}`)
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/product/delete/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**CATEGORY */
    static async createCategory(body) {
        const response = await axios.post(`${this.BASE_URL}/category/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getAllCategory() {
        const response = await axios.get(`${this.BASE_URL}/category/get-all`)
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/category/get-category-by-id/${categoryId}`)
        return response.data;
    }

    static async updateCategory(categoryId, body) {
        const response = await axios.put(`${this.BASE_URL}/category/update/${categoryId}`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/category/delete/${categoryId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    /**ORDEDR */
    static async createOrder(body) {
        const response = await axios.post(`${this.BASE_URL}/order/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getAllOrders() {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getOrderItemById(itemId) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: {itemId}
        })
        return response.data;
    }

    static async getAllOrderItemsByStatus(status) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: {status}
        })
        return response.data;
    }

    static async updateOrderitemStatus(orderItemId, status) {
        const response = await axios.put(`${this.BASE_URL}/order/update-item-status/${orderItemId}`, {}, {
            headers: this.getHeader(),
            params: {status}
        })
        return response.data;
    }

    static async approveOrder(orderId) {
        const response = await axios.put(`${this.BASE_URL}/order/approve/${orderId}`, {}, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async rejectOrder(orderId) {
        const response = await axios.put(`${this.BASE_URL}/order/reject/${orderId}`, {}, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getUserOrders() {
        const response = await axios.get(`${this.BASE_URL}/order/my-orders`, {
            headers: this.getHeader()
        })
        return response.data;
    }




    /**ADDRESS */
    static async saveAddress(body) {
        const response = await axios.post(`${this.BASE_URL}/address/save`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    /***AUTHEMNTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN' || role === 'NORMAL_ADMIN'
    }

    static isSuperAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    /**CUSTOMERS */
    static async getAllCustomers() {
        const response = await axios.get(`${this.BASE_URL}/user/get-all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getCustomerById(customerId) {
        const response = await axios.get(`${this.BASE_URL}/user/get-by-id/${customerId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**ADMIN ACCOUNTS */
    static async getAllAdmins() {
        const response = await axios.get(`${this.BASE_URL}/user/admin/get-all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async createNormalAdmin(adminData) {
        const response = await axios.post(`${this.BASE_URL}/user/admin/create-normal-admin`, adminData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateNormalAdmin(adminId, adminData) {
        const response = await axios.put(`${this.BASE_URL}/user/admin/update-normal-admin/${adminId}`, adminData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteNormalAdmin(adminId) {
        const response = await axios.delete(`${this.BASE_URL}/user/admin/delete-normal-admin/${adminId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async changeNormalAdminPassword(adminId, oldPassword, newPassword) {
        const response = await axios.put(`${this.BASE_URL}/user/admin/change-normal-admin-password/${adminId}`, {}, {
            headers: this.getHeader(),
            params: { oldPassword, newPassword }
        });
        return response.data;
    }

    /**REVENUE STATISTICS */
    static async getRevenueStats(period) {
        const response = await axios.get(`${this.BASE_URL}/payment/revenue-stats`, {
            headers: this.getHeader(),
            params: { period }
        });
        return response.data;
    }

    /**ORDER CANCEL */
    static async cancelOrder(orderId) {
        const response = await axios.put(`${this.BASE_URL}/order/cancel/${orderId}`, {}, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateOrderStatus(orderId, status) {
        const response = await axios.put(`${this.BASE_URL}/order/update-status/${orderId}`, {}, {
            headers: this.getHeader(),
            params: { status }
        });
        return response.data;
    }

    static async getOrderById(orderId) {
        const response = await axios.get(`${this.BASE_URL}/order/${orderId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**PAYMENT */
    static async processPayment(paymentRequest) {
        const response = await axios.post(`${this.BASE_URL}/payment/process`, paymentRequest, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getPaymentByOrderId(orderId) {
        const response = await axios.get(`${this.BASE_URL}/payment/order/${orderId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

}