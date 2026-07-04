# Architecture Decision Record

## NurseNourish E-commerce Platform

### Clean Architecture (Backend)

**Why Clean Architecture?**

Clean Architecture separates concerns into layers:
- **Framework Layer** - Express, Prisma
- **Interface Layer** - Controllers, routes
- **Application Layer** - Services (business logic)
- **Domain Layer** - Entities, repositories
- **Infrastructure Layer** - Prisma, external services

This makes the codebase:
1. Testable - Business logic doesn't know about Express
2. Flexible - Swap Prisma for another ORM
3. Maintainable - Clear file organization

**Layer Rules:**
- Controllers handle HTTP
- Services orchestrate use cases
- Repositories are the only layer with Prisma access
- DTOs explicitly map data (never expose Prisma models)

### Feature-based Architecture (Frontend)

**Why Feature Folders?**

Each domain (cart, auth, order) gets its own folder with:
- `api/` - API calls
- `components/` - UI components
- `hooks/` - React Query hooks
- `store/` - Zustand state
- `types/` - TypeScript types

Benefits:
1. Colocation - All code for a feature in one place
2. Scalability - Easy to add/remove features
3. Clear boundaries - Auth can't accidentally use Cart state

### State Management

| State Type | Library | Reason |
|------------|---------|--------|
| Server State | TanStack Query | Caching, background refetch |
| Client State | Zustand | Cart, auth - persisted to localStorage |

### Database Schema

- Users with roles (CUSTOMER, ADMIN)
- Products with categories, brands, images
- Orders with order items
- Payments for transaction tracking
- Inventory for stock management

### Payments Flow

1. Customer clicks "Checkout"
2. Frontend creates order
3. Frontend calls `/payments/initialize`
4. Redirect to Paystack
5. Paystack webhook updates payment status
6. Show order confirmation

This keeps sensitive logic on the backend while providing a smooth UX.