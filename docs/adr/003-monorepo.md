# Monorepo Structure

## Status

Accepted

## Context

The project consists of multiple applications (API, Web) that share code:
- Need to share types and schemas between frontend and backend
- Want to maintain single repository for easier coordination
- Require separate deployment pipelines

## Decision

We will use a monorepo structure with npm workspaces/turbo for:
- Shared packages in `packages/shared`
- API in `apps/api`
- Web in `apps/web`

## Consequences

- Shared types and schemas avoid duplication
- Atomic commits across related changes
- Easier to maintain consistent versions
- Simplified local development with `npm run dev` from root