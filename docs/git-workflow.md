# Git Workflow

## Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feat/<name>` - Feature branches
- `fix/<name>` - Bug fix branches
- `chore/<name>` - Maintenance tasks

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search with filters
fix: correct inventory quantity calculation
chore: update dependencies
docs: add API guidelines
refactor: extract pagination helper
test: add product service tests
```

## PR Workflow

1. Create feature branch from `develop`
2. Implement changes with atomic commits
3. Run `npm run lint` and `npm run build`
4. Push and create PR to `develop`
5. Squash merge with descriptive message
6. Delete feature branch

## Pre-commit Hooks

Configured via Husky + lint-staged:
- ESLint auto-fix
- Prettier formatting
- No failing files can be committed