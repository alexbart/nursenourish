# NurseNourish

Premium nutritional supplements and healthcare essentials delivered across Kenya.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd NurseNourish

# Install backend dependencies
cd backend
npm install

# Install storefront dependencies  
cd ../apps/storefront
npm install

# Start all services
cd ../backend
npx tsx watch src/server.ts  # Backend on :5000

cd ../apps/storefront
npm run dev                    # Frontend on :3000
```

## 📁 Project Structure

```
├── backend/           # Express API server
│   ├── src/
│   │   ├── modules/   # Clean Architecture modules
│   │   │   ├── product/
│   │   │   ├── category/
│   │   │   ├── brand/
│   │   │   ├── auth/
│   │   │   └── payment/
│   │   ├── prisma/    # Database schema
│   │   └── routes/    # API routes
│   └── .env.example
├── apps/storefront/     # React storefront
│   ├── src/
│   │   ├── features/  # Domain modules (cart, auth)
│   │   ├── pages/     # Route pages
│   │   ├── components/
│   │   └── hooks/
│   └── .env.example
└── packages/shared/     # Shared DTOs and types
```

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/nursenourish

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your-key
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Storefront (`apps/storefront/.env`)
```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-key
```

## 🛠️ Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend dev server |
| `npm run build` | Build backend |
| `npm run seed` | Seed database with sample data |
| `npm run import:products` | Import from Excel file |

## 🐳 Docker

```bash
docker-compose up -d
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# PostgreSQL: localhost:5432
```

# Admin

The product import utility is a backend script (not exposed in frontend):

```bash
# Import from default location
cd backend
npm run import:products

# Import from specific file
npm run import:products -- ./NurseNourish_Master_Retail_Catalog_2026.xlsx
```

Excel columns expected:
- `SKU Code` - Product SKU
- `Product Name & Variant` - Product name
- `Category` - Category name
- `Target Retail (KES)` - Price
- `Core Active Ingredients` - Description/ingredients
- `Pack Size` - Pack size

## 📚 API

### Authentication
- `POST /api/v1/auth/register` - Register customer
- `POST /api/v1/auth/login` - Login + tokens
- `POST /api/v1/auth/refresh` - Refresh access token

### Products
- `GET /api/v1/products` - List products (supports `?page=&limit=&search=&category=`)
- `GET /api/v1/products/:slug` - Get product by slug
- `GET /api/v1/categories` - List categories

### Orders
- `POST /api/v1/orders` - Create order (requires JWT)
- `GET /api/v1/orders` - List customer orders

### Payments
- `POST /api/v1/payments/initialize` - Initialize Paystack
- `GET /api/v1/payments/verify/:ref` - Verify payment

## 🏗️ Architecture

**Backend - Clean Architecture:**
- **Controller** - HTTP handlers
- **Service** - Business logic
- **Repository** - Data access (only layer with Prisma)
- **DTOs** - Explicit mappings, never expose Prisma models

**Frontend - Feature-based:**
- Each domain (cart, auth) has its own folder
- Zustand for client state (cart, auth)
- TanStack Query for server state (products, orders)

## 🚀 Deployment

| Platform | Service |
|----------|---------|
| Database | Neon or Supabase |
| Backend | Railway, Render, DigitalOcean |
| Frontend | Vercel |
| Images | Cloudinary |
| DNS/SSL | Cloudflare |

## 📋 Roadmap

Phase 2:
- Admin dashboard
- Cloudinary integration
- Inventory management
- Order history page
- Email notifications
- Automated testing