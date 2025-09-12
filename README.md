# 🛍️ E-commerce Store (Full-Stack)

[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blueviolet)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7)](https://render.com/)

A production-ready full-stack e-commerce web application built with modern technologies, featuring a separate admin panel and API versioning.

> 🔗 **Backend API**: [E-commerce API (Project 3)](https://github.com/dera-delis/E-commerce-API)

## 🏗️ Architecture

```mermaid
graph TD
    subgraph "Frontend Layer"
        A[Customer Storefront<br/>React + Tailwind]
        B[Admin Panel<br/>React + Tailwind<br/>Port 5030]
    end
    
    subgraph "Backend Layer"
        C[FastAPI Backend<br/>Port 8000]
        D[E-commerce API<br/>Project 3]
    end
    
    subgraph "Data Layer"
        E[(PostgreSQL<br/>Database)]
    end
    
    subgraph "Deployment"
        F[Vercel<br/>Frontend]
        G[Render/Northflank<br/>Backend]
        H[Docker<br/>Local Development]
    end
    
    A -->|API calls| C
    B -->|API calls| C
    C -->|Data requests| D
    C -->|Direct queries| E
    D -->|Data storage| E
    
    A -.->|Deploy| F
    C -.->|Deploy| G
    A -.->|Dev| H
    C -.->|Dev| H
    E -.->|Dev| H
```

## ✨ Features

### 🎯 Core Features
- **Authentication**: JWT-based user signup/login/logout with role-based access
- **Storefront**: Amazon-style UI with sticky header, search, and responsive design
- **Product Management**: Product listings, details, categories, and search
- **Shopping Cart**: Persistent cart with quantity management and checkout flow
- **Order Management**: Order tracking, history, and admin order management
- **Admin Panel**: Separate admin portal on port 5030 with full management capabilities
- **API Versioning**: Versioned API endpoints (`/api/v1/`) for scalability and backward compatibility

### 🎨 UI/UX Features
- Sticky header with logo, search bar, and cart icon
- Responsive design (mobile-first approach)
- Modern product grid with hover effects
- Cart drawer/sidebar for desktop and mobile
- Clean, professional design using Tailwind CSS
- Separate admin interface with role-based access
- Interactive buttons and forms with proper feedback

### 🔐 Security Features
- **Role-based Authentication**: Separate admin and customer access
- **JWT Token Security**: Secure token-based authentication
- **CORS Protection**: Properly configured cross-origin resource sharing
- **API Versioning**: Future-proof API design with version management
- **Separate Admin Portal**: Isolated admin access on different port

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **PostgreSQL** - Reliable relational database
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **JWT** - Authentication and authorization

### Frontend
- **React 18+** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework (properly installed)
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Admin Frontend
- **React 18+** - Separate admin interface
- **Tailwind CSS** - Professional admin styling
- **React Router** - Protected admin routes
- **Role-based Access** - Admin-only functionality

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend deployment
- **Northflank/Render** - Backend deployment

## 📸 Screenshots

### Homepage
![Homepage](frontend/public/screenshots/homepage.png)

### Product Listing
![Product Listing](frontend/public/screenshots/listing.png)

### Product Detail
![Product Detail](frontend/public/screenshots/product-detail.png)

### Cart Drawer
![Cart Drawer](frontend/public/screenshots/cart-drawer.png)

### Checkout
![Checkout](frontend/public/screenshots/checkout.png)

### Admin Dashboard
![Admin Dashboard](admin-frontend/public/screenshots/admin-dashboard.png)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.9+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dera-delis/E-commerce-Store.git
   cd E-commerce-Store
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Customer Frontend**: http://localhost:3000
   - **Admin Panel**: http://localhost:5030
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs
   - **API Version Info**: http://localhost:8000/api/version

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Admin Frontend
```bash
cd admin-frontend
npm install
npm start
```

## 📁 Project Structure

```
ecommerce-store/
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py              # Entry point with API versioning
│   │   ├── config.py            # Environment configuration
│   │   └── routers/             # Versioned API routes
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                    # React customer frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React context providers
│   │   ├── api/                 # API integration
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── admin-frontend/              # React admin frontend
│   ├── src/
│   │   ├── components/          # Admin components
│   │   ├── pages/               # Admin pages
│   │   ├── context/             # Admin auth context
│   │   ├── api/                 # Admin API integration
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── API_VERSIONING.md           # API versioning documentation
├── README.md
└── .env.example
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Integration
ECOMMERCE_API_URL=https://api.example.com
ECOMMERCE_API_KEY=your-api-key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Deploy automatically on push to main branch

### Backend (Northflank/Render)
1. Connect your GitHub repository
2. Configure environment variables
3. Set build and start commands
4. Deploy automatically on push to main branch

## 🔐 Demo Credentials

### Customer Account
- **Email**: `test@example.com`
- **Password**: `password`
- **Access**: Customer frontend at http://localhost:3000

### Admin Account
- **Email**: `admin@ecommerce.com`
- **Password**: `admin123`
- **Access**: Admin panel at http://localhost:5030

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Version Info**: http://localhost:8000/api/version
- **Health Check**: http://localhost:8000/health

## 🎛️ Admin Panel Features

The admin panel (http://localhost:5030) includes:

### Dashboard
- **Statistics Overview**: Total products, orders, revenue, pending orders
- **Quick Actions**: Navigate to products, orders, and generate reports
- **Real-time Data**: Live statistics from the backend

### Product Management
- **Product List**: View all products with details
- **Add Product**: Create new products (demo functionality)
- **Edit Product**: Modify existing products (demo functionality)
- **Delete Product**: Remove products with confirmation (demo functionality)

### Order Management
- **Order List**: View all customer orders
- **Status Filter**: Filter orders by status (pending, processing, shipped, delivered)
- **View Order**: See detailed order information (demo functionality)
- **Update Order**: Modify order status and details (demo functionality)

### Security Features
- **Role-based Access**: Only admin users can access the panel
- **Separate Port**: Admin panel runs on port 5030 for security isolation
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: All admin routes require authentication

## 🔄 API Versioning

This project implements API versioning for scalability and backward compatibility:

### Version Structure
- **Current Version**: `v1`
- **API Prefix**: `/api/v1/`
- **Example**: `http://localhost:8000/api/v1/products`

### Versioned Endpoints
```
# Authentication
POST /api/v1/auth/login
POST /api/v1/auth/signup
GET  /api/v1/auth/me

# Products
GET  /api/v1/products
GET  /api/v1/products/{id}
GET  /api/v1/products/categories

# Cart
GET  /api/v1/cart
POST /api/v1/cart/add
PUT  /api/v1/cart/items/{id}

# Admin
GET  /api/v1/admin/stats
GET  /api/v1/admin/products
GET  /api/v1/admin/orders
```

### Benefits
- **Backward Compatibility**: Existing clients continue to work
- **Scalability**: Easy to add new features without breaking changes
- **Future-proof**: Clear migration path for API evolution
- **Professional Architecture**: Demonstrates enterprise-level thinking

For detailed API versioning documentation, see [API_VERSIONING.md](API_VERSIONING.md).

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Admin Frontend Tests
```bash
cd admin-frontend
npm test
```

### Docker Tests
```bash
# Test all services
docker-compose up -d
docker-compose ps

# Test individual services
docker-compose up -d postgres
docker-compose up -d backend
docker-compose up -d frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

