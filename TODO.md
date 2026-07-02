# NurseNourish - TODO

## ✅ Completed

### Monorepo Structure
- [x] Migrated to Turborepo monorepo (`apps/api`, `apps/web`, `packages/*`)
- [x] Created shared package for types, DTOs, and Zod schemas
- [x] Created shared ESLint config package
- [x] Created shared TypeScript config package
- [x] Created `packages/config` for shared configuration (mail, storage, cors, helmet, rate-limit)

### Tooling
- [x] Configured ESLint, Prettier
- [x] Configured Husky + lint-staged for pre-commit hooks
- [x] Added GitHub Actions CI workflow

### Logging
- [x] Integrated Pino HTTP logging (replaced Morgan)
- [x] Added pino-pretty for development

### Documentation
- [x] Created `docs/architecture.md` - Clean Architecture overview
- [x] Created `docs/roadmap.md` - Project roadmap
- [x] Created `docs/database.md` - Database schema design
- [x] Created `docs/api-guidelines.md` - API response standards
- [x] Created `docs/git-workflow.md` - Git branch strategy
- [x] Created ADRs: 001-postgresql, 002-prisma, 003-monorepo, 004-paystack
- [x] Added Swagger/OpenAPI configuration

### Clean Architecture Refactor
- [x] **Category module** → `domain/`, `application/`, `infrastructure/`, `presentation/`
- [x] **Brand module** → `domain/`, `application/`, `infrastructure/`, `presentation/`
- [x] **Product module** → `domain/`, `application/`, `infrastructure/`, `presentation/`
- [x] All modules use repository interfaces + DTO mappers
- [x] Prisma models never leave the service layer (DTO rule enforced)

### Shared Package (`packages/shared`)
- [x] `types/` - Product, Category, Brand, Pagination, API response types
- [x] `dto/` - ProductDTO, CategoryDTO, BrandDTO with mappers
- [x] `schemas/` - Zod validation schemas (createProduct, createCategory, createBrand)
- [x] `constants/` - Error codes, product status, roles

### API Response Standards
- [x] Success (200): `{ data: T }`
- [x] Created (201): `{ message: string, data: T }`
- [x] Deleted (204): No body
- [x] Error (4xx/5xx): `{ error: { code, message } }`

### Repository Pattern
- [x] Created `src/shared/base.repository.ts`
- [x] All modules use repository interfaces with Prisma implementations
- [x] Dependency injection via constructor

## Pending

### Testing
- [ ] Add Vitest/Jest for unit testing
- [ ] Add integration tests in `tests/integration/`
- [ ] Add test fixtures in `tests/fixtures/`

### Frontend
- [ ] Implement React frontend in `apps/web`

### Inventory Module
- [ ] Refactor stock-movement module to Clean Architecture
- [ ] Build full Inventory module

### Remaining Modules
- [ ] Refactor auth module to Clean Architecture
- [ ] Refactor order module to Clean Architecture
- [ ] Refactor payment module to Clean Architecture
- [ ] Refactor review module to Clean Architecture
- [ ] Refactor user module to Clean Architecture
- [ ] Refactor admin module to Clean Architecture
- [ ] Refactor cart module to Clean Architecture