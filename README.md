# NurseNourish

Premium nutritional supplements and healthcare essentials delivered across Kenya.

## Architecture

**Clean Architecture (Backend):**
- Controller → Service → Repository
- DTOs never expose Prisma models
- Shared contracts in `@nursenourish/shared`

**Feature-based (Storefront):**
- `features/` - Domain modules (cart, auth, order)
- `pages/` - Route pages
- `components/` - UI components
- `hooks/` - TanStack Query hooks
- `api/` - API functions

## Installation

```bash
# Install all dependencies
npm install

# Run backend
cd backend
npx tsx watch src/server.ts

# Run storefront
cd apps/storefront
npm run dev
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=
JWT_REFRESH_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
```

### Storefront (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxx
```

## Scripts

### Backend
- `npm run dev` - Start dev server (tsx)
- `npm run build` - Build TypeScript
- `npm run import:products` - Import products from Excel

### Storefront
- `npm run dev` - Start Vite dev server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/products` | GET | List/search products |
| `/api/v1/products/:slug` | GET | Get product by slug |
| `/api/v1/categories` | GET | List categories |
| `/api/v1/auth/register` | POST | Register customer |
| `/api/v1/auth/login` | POST | Login + get tokens |
| `/api/v1/auth/refresh` | POST | Refresh access token |
| `/api/v1/orders` | POST | Create order (auth required) |
| `/api/v1/payments/initialize` | POST | Initialize Paystack payment |
| `/api/v1/payments/verify/:ref` | GET | Verify payment |
| `/api/v1/payments/webhook` | POST | Paystack webhook |

## Deployment

- **PostgreSQL**: Neon or Supabase
- **Backend**: Railway, Render, or DigitalOcean
- **Storefront**: Vercel
- **Images**: Cloudinary
- **Domain/SSL**: Cloudflare (automatic)

## Future Roadmap

Phase 2:
- Admin dashboard
- Cloudinary integration
- Inventory management
- Order history
- Email notifications