# Tài Liệu Sơ Đồ Hệ Thống E-commerce Phone Shop

## Mô tả
Thư mục này chứa các sơ đồ và tài liệu mô tả hệ thống E-commerce Phone Shop bao gồm:
- Sơ đồ Use Case
- Sơ đồ ERD (Entity Relationship Diagram)
- Sơ đồ Sequence
- Cấu trúc Cơ sở Dữ liệu

## Danh sách Tài liệu

### 1. [UseCase_Diagram.md](./UseCase_Diagram.md)
Sơ đồ use case mô tả:
- Các actors: User, Admin, Normal Admin
- Các use cases chính của hệ thống
- Quan hệ giữa actors và use cases

**Các nhóm chức năng:**
- Xác thực (Authentication)
- Quản lý Sản phẩm (Product Management)
- Quản lý Danh mục (Category Management)
- Quản lý Đơn hàng (Order Management)
- Quản lý Thanh toán (Payment Management)
- Quản lý Người dùng (User Management)
- Quản lý Địa chỉ (Address Management)

### 2. [ERD_Diagram.md](./ERD_Diagram.md)
Sơ đồ ERD mô tả:
- 8 bảng chính trong database
- Mối quan hệ giữa các bảng (1:1, 1:N, N:N)
- Các khóa chính (PK) và khóa ngoại (FK)
- Chi tiết các trường trong mỗi bảng

**Các bảng:**
- `users` - Người dùng
- `addresses` - Địa chỉ
- `categories` - Danh mục
- `products` - Sản phẩm
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `payments` - Thanh toán
- `reviews` - Đánh giá

### 3. [Sequence_Diagrams.md](./Sequence_Diagrams.md)
Các sơ đồ sequence mô tả luồng tương tác cho:
1. **Đăng nhập** - Quy trình xác thực người dùng
2. **Đăng ký** - Quy trình tạo tài khoản mới
3. **Tạo Đơn hàng** - Quy trình đặt hàng và thanh toán
4. **Tạo Sản phẩm** - Quy trình admin tạo sản phẩm mới
5. **Duyệt Đơn hàng** - Quy trình admin duyệt đơn hàng
6. **Tìm kiếm Sản phẩm** - Quy trình tìm kiếm sản phẩm
7. **Xem Thống kê Doanh thu** - Quy trình xem báo cáo

### 4. [Database_Structure.md](./Database_Structure.md)
Tài liệu chi tiết về cấu trúc database:
- Sơ đồ cấu trúc bảng
- Bảng mô tả chi tiết từng cột
- Kiểu dữ liệu và ràng buộc
- SQL script tạo database
- Indexes và Foreign Keys
- Unique Constraints

## Cách sử dụng

### Xem sơ đồ Mermaid
Các sơ đồ được viết bằng Mermaid syntax, có thể xem bằng:
1. **GitHub/GitLab**: Tự động render Mermaid trong markdown
2. **VS Code**: Cài extension "Markdown Preview Mermaid Support"
3. **Online Editor**: https://mermaid.live/
4. **Documentation Tools**: MkDocs, Docusaurus, etc.

### Export sang hình ảnh
1. Copy code Mermaid vào https://mermaid.live/
2. Export sang PNG/SVG
3. Hoặc sử dụng Mermaid CLI:
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   mmdc -i ERD_Diagram.md -o ERD_Diagram.png
   ```

## Công nghệ sử dụng

- **Backend**: Spring Boot (Java)
- **Frontend**: React.js
- **Database**: MySQL 8.0
- **Storage**: AWS S3 (cho ảnh sản phẩm)
- **Authentication**: JWT (JSON Web Token)
- **Security**: Spring Security

## Cấu trúc Dự án

```
Ecommerce_PhoneShop/
├── backend/          # Spring Boot application
│   ├── entity/      # JPA entities
│   ├── controller/  # REST controllers
│   ├── service/     # Business logic
│   └── repository/  # Data access layer
├── frontend/         # React application
│   ├── component/   # React components
│   └── service/     # API services
└── docs/            # Tài liệu (thư mục này)
```

## Liên hệ và Hỗ trợ

Nếu có câu hỏi hoặc cần làm rõ thêm về các sơ đồ, vui lòng tham khảo:
- Code source trong thư mục `backend/` và `frontend/`
- File `README.md` ở root project
- Các file configuration trong `docker-compose.yml`

