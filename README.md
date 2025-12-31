# PhoneStore - E-Commerce Platform

A full-stack e-commerce web application for selling mobile phones, built with Spring Boot and React. This project provides a complete online shopping experience with user authentication, product management, shopping cart, order processing, and an administrative dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [License](#license)

## ✨ Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT-based authentication
- **Password Recovery**: Forgot password functionality with email verification
- **Product Browsing**: Browse products with search and category filtering
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add, update, and remove items from shopping cart
- **Order Management**: Place orders and track order status
- **Address Management**: Add and edit shipping addresses
- **Payment Processing**: Secure payment handling for orders
- **Order History**: View past orders and their details
- **User Profile**: Manage personal information and account settings

### Admin Features
- **Dashboard**: Comprehensive admin dashboard with statistics
- **Product Management**: Create, update, delete, and manage products
- **Category Management**: Organize products into categories
- **Order Management**: View, approve, reject, and update order statuses
- **Customer Management**: View and manage customer accounts
- **Revenue Analytics**: View revenue statistics and reports
- **Account Management**: Create and manage admin accounts
- **Image Upload**: Upload product images to AWS S3

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.1
- **Language**: Java 17
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Cloud Storage**: AWS S3 SDK
- **Email Service**: Spring Mail (SMTP)
- **Validation**: Spring Validation

### Frontend
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.5.1
- **HTTP Client**: Axios 1.8.4
- **Icons**: React Icons 5.5.0
- **Build Tool**: Create React App
- **Web Server**: Nginx (production)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Code Coverage**: JaCoCo

## 🏗 Architecture

The application follows a three-tier architecture:

```
┌─────────────────┐
│   React Client  │ (Port 80)
└────────┬────────┘
         │ HTTP/REST API
┌────────▼────────┐
│  Spring Boot    │ (Port 8080)
│     Backend     │
└────────┬────────┘
         │ JDBC
┌────────▼────────┐
│   MySQL 8.0     │ (Port 3306)
└─────────────────┘
```

### Key Components
- **RESTful API**: Backend exposes REST endpoints for all operations
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Role-Based Access Control**: Separate user and admin roles
- **File Storage**: AWS S3 integration for product image storage
- **Email Service**: SMTP-based email for password reset functionality

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Maven**: Version 3.6 or higher
- **MySQL**: Version 8.0 or higher
- **Docker** (optional): Version 20.10 or higher
- **Docker Compose** (optional): Version 2.0 or higher

### Optional Services
- **AWS Account**: For S3 image storage (can be configured later)
- **SMTP Email Account**: For password reset functionality (Gmail recommended)

## 🚀 Installation & Setup

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ltweb
```

#### 2. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE spring_ecommerce_db;
EXIT;
```

#### 3. Backend Setup
```bash
cd backend

# Update application.properties with your database credentials
# Edit: src/main/resources/application.properties

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

### Option 2: Docker Deployment (Recommended)

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ltweb
```

#### 2. Configure Environment Variables
Create a `.env` file in the root directory (optional, for production):

```env
# AWS S3 Configuration (optional)
AWS_S3_ACCESS_KEY=your_access_key
AWS_S3_SECRET_KEY=your_secret_key

# Email Configuration (optional)
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password

# Frontend API URL
REACT_APP_API_URL=http://localhost:8080

# Frontend URL for password reset
APP_FRONTEND_URL=http://localhost:80
```

#### 3. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:8080`
- **MySQL**: `localhost:3306`

## ⚙️ Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/spring_ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Configuration
security.jwt.secret-key=your_secret_key_here
security.jwt.expiration-time=3600000

# AWS S3 Configuration
aws.s3.accessKey=your_access_key
aws.s3.secretKey=your_secret_key

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Admin Account
admin.email=admin@gmail.com
admin.password=Admin1234@@
```

### Frontend Configuration

The frontend API URL can be configured via environment variable:
```bash
REACT_APP_API_URL=http://localhost:8080
```

Or set it in `docker-compose.yml` for Docker deployment.

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm start
```

### Production Mode

**Using Docker:**
```bash
docker-compose up -d
```

**Manual Build:**
```bash
# Backend
cd backend
mvn clean package
java -jar target/backend-1.0-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# Serve the build folder using a web server
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Products
- `GET /product/get-all` - Get all products
- `GET /product/get-by-product-id/{id}` - Get product by ID
- `GET /product/get-by-category-id/{id}` - Get products by category
- `GET /product/search` - Search products
- `POST /product/create` - Create product (Admin only)
- `PUT /product/update` - Update product (Admin only)
- `DELETE /product/delete/{id}` - Delete product (Admin only)

### Categories
- `GET /category/get-all` - Get all categories
- `GET /category/get-category-by-id/{id}` - Get category by ID
- `POST /category/create` - Create category (Admin only)
- `PUT /category/update/{id}` - Update category (Admin only)
- `DELETE /category/delete/{id}` - Delete category (Admin only)

### Orders
- `POST /order-item/create` - Create order
- `GET /order-item/my-orders` - Get user's orders
- `GET /order-item/{orderId}` - Get order details
- `PUT /order-item/update-item-status/{id}` - Update order item status (Admin)
- `PUT /order-item/approve/{orderId}` - Approve order (Admin)
- `PUT /order-item/reject/{orderId}` - Reject order (Admin)
- `PUT /order-item/cancel/{orderId}` - Cancel order
- `GET /order-item/filter` - Filter orders (Admin)

### Payment
- `POST /payment/process` - Process payment
- `GET /payment/order/{orderId}` - Get payment by order
- `GET /payment/all` - Get all payments (Admin)
- `GET /payment/revenue-stats` - Get revenue statistics (Admin)

### User Management
- `GET /user/my-info` - Get current user info
- `GET /user/get-all` - Get all users (Admin)
- `POST /user/admin/create-normal-admin` - Create admin account
- `PUT /user/admin/update-normal-admin/{id}` - Update admin account
- `DELETE /user/admin/delete-normal-admin/{id}` - Delete admin account

### Address
- `POST /address/save` - Save shipping address

## 📁 Project Structure

```
ltweb/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/org/example/
│   │       │   ├── controller/      # REST controllers
│   │       │   ├── service/         # Business logic
│   │       │   ├── repository/      # Data access layer
│   │       │   ├── entity/          # JPA entities
│   │       │   ├── dto/             # Data transfer objects
│   │       │   ├── security/        # Security configuration
│   │       │   ├── exception/       # Exception handlers
│   │       │   ├── mapper/          # Entity-DTO mappers
│   │       │   └── util/            # Utility classes
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   │   ├── admin/               # Admin components
│   │   │   ├── common/              # Shared components
│   │   │   ├── context/             # React context
│   │   │   └── pages/               # Page components
│   │   ├── service/                 # API services
│   │   ├── style/                   # CSS files
│   │   └── utils/                   # Utility functions
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🐳 Docker Deployment

### Docker Compose Services

1. **MySQL**: Database service
   - Port: 3306
   - Database: `spring_ecommerce_db`
   - Persistent volume for data

2. **Backend**: Spring Boot application
   - Port: 8080
   - Multi-stage build for optimized image size
   - Health checks configured

3. **Frontend**: React application with Nginx
   - Port: 80
   - Production build served by Nginx
   - Optimized for performance

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Managing Containers

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]
```

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | MySQL connection URL | `jdbc:mysql://localhost:3306/spring_ecommerce_db` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `root` |
| `SECURITY_JWT_SECRET_KEY` | JWT secret key | (generated) |
| `SECURITY_JWT_EXPIRATION_TIME` | JWT expiration (ms) | `3600000` |
| `AWS_S3_ACCESS_KEY` | AWS S3 access key | (empty) |
| `AWS_S3_SECRET_KEY` | AWS S3 secret key | (empty) |
| `SPRING_MAIL_USERNAME` | Email username | (empty) |
| `SPRING_MAIL_PASSWORD` | Email password | (empty) |
| `ADMIN_EMAIL` | Admin account email | `admin@gmail.com` |
| `ADMIN_PASSWORD` | Admin account password | `Admin1234@@` |
| `APP_FRONTEND_URL` | Frontend URL for reset links | `http://localhost:80` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8080` |

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
mvn test

# Run with coverage report
mvn test jacoco:report

# Coverage report location
# target/site/jacoco/index.html
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📝 Default Admin Credentials

After first startup, you can login with:

- **Email**: `admin@gmail.com`
- **Password**: `Admin1234@@`

**⚠️ Important**: Change these credentials in production!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Spring Boot community
- React community
- All contributors and open-source libraries used in this project

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Note**: This is a development project. For production deployment, ensure:
- Strong JWT secret keys
- Secure database credentials
- HTTPS configuration
- Proper error handling and logging
- Security audit and penetration testing
- Regular dependency updates

