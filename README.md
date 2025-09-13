# 🛒 **E-Commerce Store - Full Stack Application**

A modern, full-stack e-commerce application built with **React**, **FastAPI**, and **PostgreSQL**, featuring a complete admin panel and real-time data synchronization.

## 🚀 **Live Demo**

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:5030
- **API Documentation**: http://localhost:8000/docs

## 📸 **Screenshots**

### **Frontend Customer Experience**

<details>
<summary>🏠 Homepage</summary>

![Homepage](frontend/public/screenshots/homepage.png)
*Modern landing page with hero section, featured products, and responsive design*

</details>

<details>
<summary>🛍️ Product Listing</summary>

![Product Listing](frontend/public/screenshots/listing.png)
*Product grid with search, filtering, and real-time favorites functionality*

</details>

<details>
<summary>📱 Product Detail</summary>

![Product Detail](frontend/public/screenshots/product-detail.png)
*Detailed product view with image gallery, pricing, and add-to-cart functionality*

</details>

<details>
<summary>🛒 Shopping Cart</summary>

![Cart Drawer](frontend/public/screenshots/cart-drawer.png)
*Interactive cart drawer with item management and checkout flow*

</details>

<details>
<summary>💳 Checkout Process</summary>

![Checkout](frontend/public/screenshots/checkout.png)
*Complete checkout form with order summary and payment processing*

</details>

<details>
<summary>🔐 User Authentication</summary>

![Login](frontend/public/screenshots/login.png)
*Secure login system with error handling and form validation*

</details>

### **Admin Panel**

<details>
<summary>🔑 Admin Login</summary>

![Admin Login](admin-frontend/public/screenshots/admin-login.png)
*Secure admin authentication with role-based access control*

</details>

<details>
<summary>📊 Admin Dashboard</summary>

![Admin Dashboard](admin-frontend/public/screenshots/admin-dashboard.png)
*Comprehensive dashboard with real-time statistics and quick actions*

</details>

<details>
<summary>📦 Product Management</summary>

![Admin Products](admin-frontend/public/screenshots/admin-products.png)
*Complete CRUD operations for product management with image upload*

</details>

<details>
<summary>📋 Order Management</summary>

![Admin Orders](admin-frontend/public/screenshots/admin-orders.png)
*Order tracking and management with status updates and customer details*

</details>

### **Backend API**

<details>
<summary>📚 API Documentation</summary>

![API Docs](backend/screenshots/api-docs.png)
*Interactive Swagger UI documentation for all API endpoints*

</details>

<details>
<summary>🔧 API Version</summary>

![API Version](backend/screenshots/api-version.png)
*API versioning and endpoint information*

</details>

## 🏗️ **Architecture**

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Frontend<br/>localhost:3000]
        B[Admin Panel<br/>localhost:5030]
    end
    
    subgraph "Backend Layer"
        C[FastAPI Server<br/>localhost:8000]
        D[PostgreSQL Database]
        E[Redis Cache]
    end
    
    subgraph "Infrastructure"
        F[Docker Containers]
        G[Nginx Load Balancer]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    F --> A
    F --> B
    F --> C
    F --> D
    F --> E
```

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

### **Backend**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Python ORM
- **PostgreSQL** - Relational database
- **Redis** - In-memory data store
- **JWT** - Authentication tokens
- **Pydantic** - Data validation

### **DevOps**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy

## ✨ **Key Features**

### **Customer Features**
- 🛍️ **Product Browsing** - Search, filter, and categorize products
- ❤️ **Favorites System** - Save products for later (persistent across sessions)
- 🛒 **Shopping Cart** - Add/remove items with real-time updates
- 💳 **Checkout Process** - Complete order placement with validation
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **User Authentication** - Secure login/signup system
- 📦 **Order History** - Track past orders with detailed information

### **Admin Features**
- 📊 **Dashboard** - Real-time statistics and analytics
- 📦 **Product Management** - CRUD operations with image upload
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - Customer account oversight
- 🔄 **Real-time Sync** - Changes reflect instantly across frontend
- 📈 **Analytics** - Sales and performance metrics

### **Technical Features**
- 🚀 **API Versioning** - `/api/v1/` endpoint structure
- 🔒 **JWT Authentication** - Secure token-based auth
- 💾 **Data Persistence** - PostgreSQL with proper relationships
- 🖼️ **Image Upload** - Direct file upload to server
- 🔄 **CORS Support** - Cross-origin resource sharing
- 📝 **API Documentation** - Auto-generated Swagger UI
- 🐳 **Dockerized** - Easy deployment and scaling

## 🚀 **Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd E-commerce-Store
```

2. **Start the application**
```bash
docker-compose up -d --build
```

3. **Access the application**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:5030
- API Docs: http://localhost:8000/docs

### **Default Credentials**

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Test Customer:**
- Email: `test@example.com`
- Password: `test123`

## 📊 **Database Schema**

```sql
-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE,
    name VARCHAR,
    password_hash VARCHAR,
    role VARCHAR DEFAULT 'customer',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id VARCHAR PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    price FLOAT,
    category VARCHAR,
    image_url VARCHAR,
    stock INTEGER DEFAULT 0,
    rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    status VARCHAR DEFAULT 'pending',
    subtotal FLOAT,
    tax FLOAT,
    shipping FLOAT,
    total FLOAT,
    shipping_address JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR REFERENCES orders(id),
    product_id VARCHAR,
    name VARCHAR,
    price FLOAT,
    quantity INTEGER,
    subtotal FLOAT,
    image_url VARCHAR
);
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/auth/me` - Get current user

### **Products**
- `GET /api/v1/products` - List products (with pagination, search, filters)
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/categories` - Get product categories

### **Cart**
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart

### **Orders**
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/{id}` - Get order details

### **Admin**
- `GET /api/v1/admin/stats` - Get admin statistics
- `GET /api/v1/admin/products` - Manage products
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/{id}` - Update product
- `DELETE /api/v1/admin/products/{id}` - Delete product
- `GET /api/v1/admin/orders` - Manage orders
- `PUT /api/v1/admin/orders/{id}` - Update order

### **File Upload**
- `POST /api/v1/upload/image` - Upload product images

## 🧪 **Testing**

### **Backend API Testing**
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test version endpoint
curl http://localhost:8000/api/version

# Test products endpoint
curl http://localhost:8000/api/v1/products
```

### **Frontend Testing**
1. Navigate to http://localhost:3000
2. Test product browsing and search
3. Add items to cart and favorites
4. Complete checkout process
5. Test user authentication

### **Admin Panel Testing**
1. Navigate to http://localhost:5030
2. Login with admin credentials
3. Test product management (CRUD operations)
4. Test order management and updates
5. Verify real-time synchronization

## 📈 **Performance Features**

- **Lazy Loading** - Images and components load on demand
- **Caching** - Redis for session and data caching
- **Database Indexing** - Optimized queries with proper indexes
- **Image Optimization** - Compressed and responsive images
- **Code Splitting** - Optimized bundle sizes

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Configured cross-origin policies
- **Input Validation** - Pydantic models for data validation
- **SQL Injection Prevention** - SQLAlchemy ORM protection
- **Role-based Access** - Admin and customer role separation

## 🚀 **Deployment**

### **Production Deployment**
1. Update environment variables
2. Configure production database
3. Set up SSL certificates
4. Deploy with Docker Compose
5. Configure domain and DNS

### **Environment Variables**
```env
DATABASE_URL=postgresql://user:password@localhost/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Developer**

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 **Acknowledgments**

- React team for the amazing framework
- FastAPI team for the excellent Python web framework
- Tailwind CSS for the utility-first CSS framework
- PostgreSQL team for the robust database system

---

**Built with ❤️ using modern web technologies**