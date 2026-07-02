# Architecture

## Overview

Nursenourish follows Clean Architecture principles with Domain-Driven Design patterns.

## Structure

```
apps/
  api/
    src/
      modules/
        <module>/
          domain/          # Business logic, entities, repository interfaces
          application/     # Services (use cases)
          infrastructure/  # External implementations (Prisma, Cloudinary)
          presentation/    # Express controllers, routes, validators
          dto/            # Mappers and response types

packages/
  shared/               # Shared types, schemas, DTOs across apps
  config/               # Shared configuration (future)
```

## Flow

Requests flow through presentation → application → infrastructure → database.

Responses flow upward through mapper → DTO → JSON.

This ensures:
- Business logic is isolated from frameworks
- Prisma models never leave the service layer
- Easy to test each layer independently