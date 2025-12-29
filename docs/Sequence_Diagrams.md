# Sơ Đồ Sequence - Hệ Thống E-commerce Phone Shop

## Mô tả
Các sơ đồ sequence mô tả luồng tương tác giữa các thành phần trong hệ thống.

## 1. Sequence Diagram - Đăng nhập (Login)

```mermaid
sequenceDiagram
    participant U as User/Client
    participant F as Frontend
    participant A as AuthController
    participant US as UserService
    participant JWT as JWTService
    participant DB as Database
    
    U->>F: Nhập email và password
    F->>A: POST /auth/login
    A->>US: loginUser(LoginRequest)
    US->>DB: Tìm user theo email
    DB-->>US: User entity
    US->>US: Kiểm tra password
    alt Password đúng
        US->>JWT: Tạo JWT token
        JWT-->>US: JWT token
        US-->>A: Response với token
        A-->>F: 200 OK + JWT token
        F->>F: Lưu token vào localStorage
        F-->>U: Chuyển đến trang chủ
    else Password sai
        US-->>A: InvalidCredentialsException
        A-->>F: 401 Unauthorized
        F-->>U: Hiển thị lỗi
    end
```

## 2. Sequence Diagram - Đăng ký (Register)

```mermaid
sequenceDiagram
    participant U as User/Client
    participant F as Frontend
    participant A as AuthController
    participant US as UserService
    participant DB as Database
    
    U->>F: Nhập thông tin đăng ký
    F->>A: POST /auth/register
    A->>US: registerUser(UserDto)
    US->>DB: Kiểm tra email đã tồn tại?
    alt Email chưa tồn tại
        US->>US: Mã hóa password
        US->>DB: Lưu user mới
        DB-->>US: User đã tạo
        US-->>A: Response thành công
        A-->>F: 200 OK
        F-->>U: Thông báo đăng ký thành công
    else Email đã tồn tại
        US-->>A: Exception
        A-->>F: 400 Bad Request
        F-->>U: Hiển thị lỗi email đã tồn tại
    end
```

## 3. Sequence Diagram - Tạo Đơn hàng (Place Order)

```mermaid
sequenceDiagram
    participant U as User/Client
    participant F as Frontend
    participant OC as OrderController
    participant OS as OrderItemService
    participant PS as ProductService
    participant DB as Database
    participant PC as PaymentController
    participant PayS as PaymentService
    
    U->>F: Chọn sản phẩm và số lượng
    U->>F: Nhấn "Đặt hàng"
    F->>OC: POST /order/create (OrderRequest + JWT)
    OC->>OS: placeOrder(OrderRequest)
    
    OS->>OS: Xác thực JWT token
    OS->>DB: Lấy thông tin user
    DB-->>OS: User entity
    
    loop Cho mỗi sản phẩm trong OrderRequest
        OS->>PS: getProductById(productId)
        PS->>DB: Tìm product
        DB-->>PS: Product entity
        PS-->>OS: ProductDto
        OS->>OS: Tính giá (price * quantity)
    end
    
    OS->>OS: Tính totalPrice
    OS->>DB: Tạo Order mới
    DB-->>OS: Order entity
    
    loop Cho mỗi sản phẩm
        OS->>DB: Tạo OrderItem
        OS->>DB: Liên kết với Order và User
    end
    
    OS-->>OC: Response với OrderId
    OC-->>F: 200 OK + OrderId
    
    F->>PC: POST /payment/process (PaymentRequest)
    PC->>PayS: processPayment(PaymentRequest)
    PayS->>DB: Tạo Payment record
    PayS->>DB: Cập nhật Order status = PAID
    PayS-->>PC: Payment thành công
    PC-->>F: 200 OK
    F-->>U: Thông báo đặt hàng thành công
```

## 4. Sequence Diagram - Tạo Sản phẩm (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant PC as ProductController
    participant PS as ProductService
    participant S3 as AWS S3 Service
    participant DB as Database
    
    A->>F: Nhập thông tin sản phẩm + upload ảnh
    F->>PC: POST /product/create (multipart/form-data + JWT)
    PC->>PC: Kiểm tra quyền ADMIN/NORMAL_ADMIN
    alt Có quyền
        PC->>PS: createProduct(categoryId, image, name, description, price)
        PS->>DB: Kiểm tra category tồn tại
        DB-->>PS: Category entity
        PS->>S3: Upload image lên S3
        S3-->>PS: Image URL
        PS->>DB: Lưu Product với imageUrl
        DB-->>PS: Product entity
        PS-->>PC: Response thành công
        PC-->>F: 200 OK
        F-->>A: Thông báo tạo sản phẩm thành công
    else Không có quyền
        PC-->>F: 403 Forbidden
        F-->>A: Hiển thị lỗi không có quyền
    end
```

## 5. Sequence Diagram - Duyệt Đơn hàng (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant OC as OrderController
    participant OS as OrderItemService
    participant DB as Database
    
    A->>F: Xem danh sách đơn hàng PENDING
    F->>OC: GET /order/filter?status=PENDING
    OC->>OS: filterOrderItems(status, ...)
    OS->>DB: Tìm orders với status = PENDING
    DB-->>OS: List<OrderItem>
    OS-->>OC: Response với danh sách
    OC-->>F: 200 OK + danh sách đơn hàng
    F-->>A: Hiển thị danh sách
    
    A->>F: Nhấn "Duyệt" cho một đơn hàng
    F->>OC: PUT /order/approve/{orderId}
    OC->>OS: approveOrder(orderId)
    OS->>DB: Tìm Order theo ID
    DB-->>OS: Order entity
    OS->>OS: Kiểm tra status = PENDING
    OS->>DB: Cập nhật Order status = APPROVED
    OS->>DB: Cập nhật tất cả OrderItems status = APPROVED
    DB-->>OS: Đã cập nhật
    OS-->>OC: Response thành công
    OC-->>F: 200 OK
    F-->>A: Thông báo duyệt thành công
```

## 6. Sequence Diagram - Tìm kiếm Sản phẩm

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant PC as ProductController
    participant PS as ProductService
    participant DB as Database
    
    U->>F: Nhập từ khóa tìm kiếm
    U->>F: Nhấn "Tìm kiếm"
    F->>PC: GET /product/search?searchValue={keyword}
    PC->>PS: searchProduct(searchValue)
    PS->>DB: Tìm products (name LIKE %keyword% OR description LIKE %keyword%)
    DB-->>PS: List<Product>
    PS->>PS: Chuyển đổi sang ProductDto
    PS-->>PC: Response với danh sách
    PC-->>F: 200 OK + danh sách sản phẩm
    F-->>U: Hiển thị kết quả tìm kiếm
```

## 7. Sequence Diagram - Xem Thống kê Doanh thu (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant PC as PaymentController
    participant PS as PaymentService
    participant DB as Database
    
    A->>F: Truy cập trang thống kê
    F->>PC: GET /payment/revenue-stats?period={period}
    PC->>PS: getRevenueStats(period)
    PS->>DB: Query payments theo period
    alt period = "all"
        DB-->>PS: Tất cả payments
    else period = "month"
        DB-->>PS: Payments trong tháng
    else period = "year"
        DB-->>PS: Payments trong năm
    end
    PS->>PS: Tính tổng doanh thu
    PS->>PS: Tính số đơn hàng
    PS->>PS: Tính trung bình giá trị đơn hàng
    PS-->>PC: Revenue statistics
    PC-->>F: 200 OK + thống kê
    F-->>A: Hiển thị biểu đồ và số liệu
```

