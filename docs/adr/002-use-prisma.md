# Use Prisma

## Status

Accepted

## Context

We need an ORM for database access that provides:
- Type-safe database queries
- Good developer experience
- Migration management
- Compatibility with PostgreSQL

## Decision

We will use Prisma as our ORM.

## Consequences

- Automatic TypeScript types from schema
- Database migrations with `prisma migrate`
- Clean, intuitive query API
- Easy to switch databases if needed (though we're committed to PostgreSQL)