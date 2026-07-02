# Use PostgreSQL

## Status

Accepted

## Context

We need a relational database for the inventory management system. Requirements include:
- Relational data model (products, categories, brands, inventory)
- ACID compliance for transaction safety
- JSONB support for flexible schemas
- Strong consistency guarantees

## Decision

We will use PostgreSQL as our primary database.

## Consequences

- Enables complex queries with joins and aggregations
- Supports transactional inventory updates
- Compatible with Prisma ORM
- Requires more operational overhead than SQLite but provides production readiness