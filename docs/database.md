# Database

## Technology

- **PostgreSQL** via Prisma ORM
- Connection pooling via Prisma's built-in pooler

## Schema Design

### Core Entities

- **User** - Customers and admins
- **Product** - Products with pricing, descriptions, and metadata
- **Category** - Product categories (hierarchical)
- **Brand** - Product brands
- **Inventory** - Stock levels per product
- **Order** - Customer orders
- **OrderItem** - Line items within orders
- **Review** - Product reviews
- **Payment** - Payment transactions

### Key Principles

1. **UUIDs** for all primary keys (not auto-increment)
2. **Soft deletes** where applicable
3. **Timestamps** on all tables (createdAt, updatedAt)
4. **Cascade deletes** only where semantically correct
5. **Indexes** on frequently queried columns (slug, SKU, foreign keys)

## Migrations

Migrations are in `apps/api/src/prisma/migrations/`.

```bash
# Create migration
npx prisma migrate dev --name <migration_name>

# Apply to production
npx prisma migrate deploy