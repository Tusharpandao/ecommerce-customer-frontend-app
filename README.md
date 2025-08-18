# E-Commerce Platform

A modern, secure, and scalable E-Commerce platform built with Next.js 14, TypeScript, and Tailwind CSS. Features role-based access control for Customers, Sellers, and Administrators with real-time updates via WebSockets.

## 🚀 Features

### 🔐 Security & Authentication
- **JWT-based authentication** with httpOnly cookies
- **Role-based route protection** using Next.js middleware
- **CSRF protection** (placeholder for backend integration)
- **Secure API calls** with credentials inclusion
- **No sensitive data in client-side storage**

### 👥 User Roles
- **Customer**: Browse products, manage cart, place orders
- **Seller**: Manage products, view orders, track sales
- **Admin**: Platform management, user management, analytics

### 🛍️ E-Commerce Features
- **Product catalog** with search, filters, and pagination
- **Shopping cart** management
- **Order processing** and tracking
- **Real-time notifications** via WebSockets
- **Responsive design** for all devices

### 🛠️ Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: JWT with httpOnly cookies
- **Real-time**: WebSocket/Socket.IO integration
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API (Spring Boot recommended)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-platform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Copy the example environment file and configure your settings:
```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# CSRF Configuration
CSRF_SECRET=your_csrf_secret_here

# App Configuration
NEXT_PUBLIC_APP_NAME=E-Commerce Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── login/             # Authentication pages
│   ├── register/
│   ├── forgot-password/
│   ├── products/          # Product listing and details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order management
│   ├── admin/             # Admin panel
│   └── seller/            # Seller panel
├── components/            # Reusable components
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   ├── products/          # Product-related components
│   ├── auth/              # Authentication components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── api.ts            # API client and methods
│   ├── auth.tsx          # Authentication context
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── middleware.ts          # Next.js middleware for route protection
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🔌 Backend API Specification

### Base URL
```
http://localhost:8080/api
```

### Authentication APIs

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isBlocked": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer"
}
```

**Response:** Same as login

#### POST /api/auth/google
**Request:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:** Same as login

#### POST /api/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

#### POST /api/auth/logout
**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /api/auth/me
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "isBlocked": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Product APIs

#### GET /api/products
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Category ID filter
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `rating` (number): Minimum rating filter
- `inStock` (boolean): In stock filter

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "images": ["image_url_1", "image_url_2"],
        "category": {
          "id": "category_id",
          "name": "Category Name"
        },
        "seller": {
          "id": "seller_id",
          "firstName": "Seller",
          "lastName": "Name"
        },
        "stock": 100,
        "rating": 4.5,
        "reviewCount": 25,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "totalPages": 13
    }
  }
}
```

#### GET /api/products/{id}
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "images": ["image_url_1", "image_url_2"],
    "category": {
      "id": "category_id",
      "name": "Category Name"
    },
    "seller": {
      "id": "seller_id",
      "firstName": "Seller",
      "lastName": "Name"
    },
    "stock": 100,
    "rating": 4.5,
    "reviewCount": 25,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/products (Seller/Admin)
**Request:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "categoryId": "category_id",
  "stock": 100,
  "images": ["image_url_1", "image_url_2"]
}
```

#### PUT /api/products/{id} (Seller/Admin)
**Request:** Same as POST (partial updates supported)

#### DELETE /api/products/{id} (Seller/Admin)
**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully"
  }
}
```

### Category APIs

#### GET /api/categories
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "image": "image_url",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/categories (Admin)
**Request:**
```json
{
  "name": "Category Name",
  "description": "Category description"
}
```

#### PUT /api/categories/{id} (Admin)
**Request:** Same as POST

#### DELETE /api/categories/{id} (Admin)
**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  }
}
```

### Cart APIs

#### GET /api/cart
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "items": [
      {
        "id": "cart_item_id",
        "product": {
          "id": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "images": ["image_url"]
        },
        "quantity": 2,
        "price": 199.98
      }
    ],
    "total": 199.98,
    "itemCount": 2
  }
}
```

#### POST /api/cart
**Request:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

#### DELETE /api/cart/{productId}
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

#### PUT /api/cart/{productId}
**Request:**
```json
{
  "quantity": 3
}
```

### Order APIs

#### GET /api/orders
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "order_id",
        "customer": {
          "id": "customer_id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "items": [
          {
            "id": "order_item_id",
            "product": {
              "id": "product_id",
              "name": "Product Name",
              "price": 99.99
            },
            "quantity": 2,
            "price": 199.98
          }
        ],
        "total": 199.98,
        "status": "pending",
        "shippingAddress": {
          "street": "123 Main St",
          "city": "City",
          "state": "State",
          "zipCode": "12345",
          "country": "Country"
        },
        "paymentStatus": "pending",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### POST /api/orders
**Request:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  }
}
```

#### PUT /api/orders/{id}/status (Admin/Seller)
**Request:**
```json
{
  "status": "shipped"
}
```

### User APIs (Admin Only)

#### GET /api/users
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "customer",
        "isBlocked": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### PUT /api/users/{id}/block
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "isBlocked": true
  }
}
```

#### PUT /api/users/{id}/unblock
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "isBlocked": false
  }
}
```

### WebSocket Events

#### Connection
```
ws://localhost:8080
```

#### Events

**orderPlaced**
```json
{
  "type": "orderPlaced",
  "data": {
    "orderId": "order_id",
    "customerName": "John Doe",
    "total": 199.98
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**orderStatusUpdated**
```json
{
  "type": "orderStatusUpdated",
  "data": {
    "orderId": "order_id",
    "status": "shipped",
    "customerId": "customer_id"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**salesUpdated**
```json
{
  "type": "salesUpdated",
  "data": {
    "totalSales": 15000.00,
    "todaySales": 1500.00,
    "orderCount": 150
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔧 Configuration

### JWT Configuration
The JWT token should include:
- `sub`: User ID
- `role`: User role (customer, seller, admin)
- `isBlocked`: Boolean flag for blocked users
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

### CORS Configuration
Backend should allow:
- Origin: `http://localhost:3000` (development)
- Credentials: `true`
- Methods: `GET`, `POST`, `PUT`, `DELETE`

### Cookie Configuration
- `httpOnly: true`
- `secure: true` (production)
- `sameSite: 'strict'`
- `maxAge`: JWT expiration time

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
JWT_SECRET=your_very_secure_jwt_secret
CSRF_SECRET=your_very_secure_csrf_secret
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Advanced product search with Elasticsearch
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Advanced inventory management
- [ ] Multi-tenant support

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
