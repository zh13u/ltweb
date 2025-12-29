# Hướng Dẫn Cấu Hình Email

## 📧 Cách Lấy Thông Tin Email

### Option 1: Sử dụng Gmail (Khuyến nghị cho development)

#### Bước 1: Tạo App Password cho Gmail

1. Đăng nhập vào tài khoản Gmail của bạn
2. Truy cập: https://myaccount.google.com/
3. Vào **Security** (Bảo mật)
4. Bật **2-Step Verification** (Xác minh 2 bước) nếu chưa bật
5. Sau khi bật 2-Step Verification, quay lại trang Security
6. Tìm mục **App passwords** (Mật khẩu ứng dụng)
7. Chọn **Mail** và **Other (Custom name)**
8. Nhập tên: "Phone Shop App"
9. Click **Generate** (Tạo)
10. **Copy mật khẩu 16 ký tự** (ví dụ: `abcd efgh ijkl mnop`)

#### Bước 2: Thông tin cấu hình Gmail

```
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com  (Email Gmail của bạn)
SPRING_MAIL_PASSWORD=abcd efgh ijkl mnop    (App Password vừa tạo, bỏ dấu cách)
```

### Option 2: Sử dụng Outlook/Hotmail

```
SPRING_MAIL_HOST=smtp-mail.outlook.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@outlook.com
SPRING_MAIL_PASSWORD=your-password
```

### Option 3: Sử dụng Yahoo Mail

```
SPRING_MAIL_HOST=smtp.mail.yahoo.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@yahoo.com
SPRING_MAIL_PASSWORD=your-app-password
```

### Option 4: Sử dụng Email Server riêng

Nếu bạn có email server riêng (ví dụ: công ty), liên hệ IT để lấy thông tin:
- SMTP Host
- SMTP Port (thường là 587 hoặc 465)
- Username
- Password

## 🔧 Cách Cấu Hình

### Cách 1: Cấu hình trong docker-compose.yml (Khuyến nghị)

Thêm các biến môi trường vào phần `backend` service trong `docker-compose.yml`:

```yaml
environment:
  - SPRING_MAIL_HOST=${SPRING_MAIL_HOST:-smtp.gmail.com}
  - SPRING_MAIL_PORT=${SPRING_MAIL_PORT:-587}
  - SPRING_MAIL_USERNAME=${SPRING_MAIL_USERNAME:-}
  - SPRING_MAIL_PASSWORD=${SPRING_MAIL_PASSWORD:-}
  - APP_FRONTEND_URL=${APP_FRONTEND_URL:-http://localhost:80}
```

Sau đó tạo file `.env` trong thư mục gốc của project:

```env
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
APP_FRONTEND_URL=http://localhost:80
```

**Lưu ý:** File `.env` không được commit lên Git! (Đã có trong .gitignore)

### Cách 2: Cấu hình trực tiếp trong application.properties

Mở file `backend/src/main/resources/application.properties` và điền trực tiếp:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.frontend.url=http://localhost:80
```

**⚠️ Cảnh báo:** Không nên commit file này lên Git nếu có thông tin nhạy cảm!

### Cách 3: Cấu hình qua Environment Variables (Production)

Khi deploy lên server, set các biến môi trường:

```bash
export SPRING_MAIL_HOST=smtp.gmail.com
export SPRING_MAIL_PORT=587
export SPRING_MAIL_USERNAME=your-email@gmail.com
export SPRING_MAIL_PASSWORD=your-app-password
export APP_FRONTEND_URL=https://yourdomain.com
```

## 🧪 Kiểm Tra Cấu Hình

Sau khi cấu hình, khởi động lại backend và thử chức năng "Quên mật khẩu":

1. Vào trang đăng nhập
2. Click "Quên mật khẩu?"
3. Nhập email đã đăng ký
4. Kiểm tra hộp thư email (có thể ở thư mục Spam)

## ❓ Troubleshooting

### Lỗi: "Authentication failed"

- Kiểm tra lại username và password
- Với Gmail: Đảm bảo đã tạo App Password, không dùng mật khẩu thường
- Kiểm tra 2-Step Verification đã bật chưa

### Lỗi: "Connection timeout"

- Kiểm tra firewall có chặn port 587 không
- Thử đổi port sang 465 (SSL) hoặc 25
- Kiểm tra kết nối internet

### Email không gửi được

- Kiểm tra log backend để xem lỗi chi tiết
- Kiểm tra email có vào thư mục Spam không
- Kiểm tra cấu hình `app.frontend.url` có đúng không

## 📝 Ví dụ File .env

Tạo file `.env` trong thư mục gốc:

```env
# Email Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=abcdefghijklmnop
APP_FRONTEND_URL=http://localhost:80

# AWS S3 (nếu có)
AWS_S3_ACCESS_KEY=your-access-key
AWS_S3_SECRET_KEY=your-secret-key
```

