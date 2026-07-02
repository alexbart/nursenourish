# API Guidelines

## Base URL

```
http://localhost:5000/api/v1
```

## Response Format

### Success (200)
```json
{
  "data": {}
}
```

### Created (201)
```json
{
  "message": "Resource created.",
  "data": {}
}
```

### Deleted (204)
No body.

### Error (4xx/5xx)
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found."
  }
}
```

## DTO Rule

**Prisma models never leave the service layer.**

Flow: Database → Prisma Model → Repository → Service → Mapper → DTO → Controller → JSON

## Naming Conventions

- Routes: `/api/v1/resources`
- Route params: `/:id` or `/:slug`
- Query params: `?page=1&limit=20&search=term`
- Response keys: `camelCase`
- Error codes: `UPPER_SNAKE_CASE`

## Pagination

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## HTTP Methods

| Method   | Purpose       |
|----------|---------------|
| GET      | Retrieve      |
| POST     | Create        |
| PUT      | Replace       |
| PATCH    | Update        |
| DELETE   | Remove        |