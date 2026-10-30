# TechNova – Backend

TechNova Backend is a RESTful API built using Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL(Neon DB).

It powers the TechNova e-commerce application and handles authentication, user management, products, categories, shopping carts, wishlists, checkout, orders, payments, coupons, shipping, and admin operations.

The backend follows a modular and layered architecture to maintain clean, reusable, and maintainable code.

## 🚀 Live API

**Backend URL:** https://technova-backend-dyrv.onrender.com

**Health Check:** https://technova-backend-dyrv.onrender.com/api/health

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Session-based authentication
- PostgreSQL-backed session management
- Secure password hashing using bcrypt
- Role-based access control (USER / ADMIN)
- Protected routes and authorization middleware
- Change password
- Logout and session management

### 👤 User Management
- User profile management
- User authentication
- User authorization

### 📦 Product Management
- Create, update, and delete products
- Retrieve products
- Product search and pagination
- Featured products
- Brand and category association
- Product inventory management

### 📂 Category Management
- Create categories
- Update categories
- Delete categories
- Retrieve categories
- Category slug generation

### 🛒 Cart Management
- Add products to cart
- Update cart item quantities
- Remove cart items
- Cart synchronization
- Cart subtotal and item calculations

### ❤️ Wishlist Management
- Add products to wishlist
- Remove products from wishlist
- Retrieve wishlist items

### 📍 Address Management
- Add delivery addresses
- Update addresses
- Delete addresses
- Retrieve user addresses

### 💳 Checkout & Payment
- Checkout processing
- Order creation
- Payment processing
- Order management

### 🎟️ Coupon Management
- Create and manage coupons
- Apply coupons
- Remove applied coupons
- Coupon validation

### 🚚 Shipping Management
- Shipping management
- Shipping configuration

### 👨‍💼 Admin Features
- Admin dashboard statistics
- Product management
- Category management
- Order management
- User management
- Coupon management
- Shipping management

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Database Hosting:** NeonDB
- **ORM:** Prisma ORM
- **Validation:** Zod
- **Authentication:** Session-based authentication
- **Password Hashing:** bcrypt


## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/rutvik-variya/Technova-Backend.git
```

### 2. Navigate to the project

```bash
cd Technova-Backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Add all other environment variables required by your actual application, including session and payment configuration where applicable.

Never commit real credentials or secrets.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

Run migrations only when setting up a development database that is configured for this project.

### 7. Start development server

```bash
npm run dev
```

The API will run on:

http://localhost:5000

## 🌐 Deployment

The backend is deployed using Render.

- Backend Hosting: Render
- Database Hosting: NeonDB
- Database: PostgreSQL

## 🔗 Related Repository

**Frontend Repository:** https://github.com/rutvik-variya/Technova-Frontend

## 👨‍💻 Author

**Rutvik Variya**

- GitHub: https://github.com/rutvik-variya

## 📄 License

This project is available under the MIT License if accompanied by the corresponding LICENSE file.
