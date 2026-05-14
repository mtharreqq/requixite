# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — production build (Turbopack)
- `npm run start` — serve the production build
- `npm run lint` — ESLint (config: `eslint.config.mjs`, extends `eslint-config-next`)
- `npm run seed:admin` — one-time admin user creation (see Auth section)
- `npm run sync:release` — insert a release row into Neon (called by CI, not manually)
- `npm run backfill:releases` — one-time: read existing `v*` git tags and insert into `releases`

There is no test runner configured. Formatting uses Prettier (`.prettierrc`) with `prettier-plugin-tailwindcss`.

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 + Drizzle ORM + Neon Postgres + Better Auth. TypeScript path alias `@/*` maps to repo root.

### Data layer (Drizzle + Neon)

- DB client: `lib/db/index.ts` exports `db` (Drizzle + `postgres-js`) connected via `DATABASE_URL`.
- Schema: `lib/db/schema.ts` — domain tables (`todos`, `releases`) + auth tables (`user`, `session`, `account`).
- Migrations are pushed with `npx drizzle-kit push`. Config: `drizzle.config.ts`.

### Auth (Better Auth, admin-only)

- This is a **single-admin app**. Public signup is disabled (`disableSignUp: true` in `lib/auth.ts`). There is no `/signup` route, no Google OAuth, no email verification, no password reset.
- Server instance: `lib/auth.ts` (uses `drizzleAdapter` with the `user`, `session`, `account` tables).
- Client instance: `lib/auth-client.ts` — use `authClient.signIn.email(...)` / `authClient.signOut()` from client components.
- Auth API handler: `app/api/auth/[...all]/route.ts` (mounts Better Auth at `/api/auth/*`).
- Route protection: `middleware.ts` redirects unauthenticated requests to `/login` for `/dashboard/:path*`. `app/dashboard/page.tsx` also does a server-side `auth.api.getSession` check as defense-in-depth.
- Creating the admin user: `ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run seed:admin`. The seed script (`scripts/seed-admin.ts`) uses a separate Better Auth config that bypasses `disableSignUp`. Re-run any time to add another admin.

### API routes

REST handlers live under `app/api/*/route.ts` (e.g. `app/api/todos/route.ts`). Conventions:

- Validate request bodies with Zod schemas from `lib/validation.ts` (`CreateTodoSchema`, `UpdateTodoSchema`, `LoginSchema`). Use `.safeParse` and return `400` with `parsed.error` on failure.
- PATCH/DELETE take `id` as a query param (`?id=...`), not a path segment.
- Responses are `{ data, ... }` (list endpoints also include `count`, `limit`, `offset`). Map missing-row errors to `404`, other errors to `500`.
- **Auth is not yet enforced inside API routes.** `todos` has no `userId` column. If you add per-user data, add `userId` to the table and gate the routes via `auth.api.getSession({ headers: await headers() })`.

### Client → API

`lib/client-todos.ts` is the typed fetch wrapper for `/api/todos` used by client components. New client-side data access should follow the same shape (typed return, `cache: "no-store"` for reads, query-string IDs for mutations) rather than calling Drizzle directly from the browser.

### UI

- shadcn/ui-style components in `components/ui/` (config: `components.json`, style "new-york", base color "neutral"). Compose with `cn()` from `lib/utils.ts`.
- App shell uses the sidebar pattern (`components/app-sidebar.tsx`, `components/ui/sidebar.tsx`) with `next-themes` for dark mode.
- Routes: `app/page.tsx` (marketing), `app/login` (admin login), `app/dashboard` (auth-gated).

### Versioning & releases

Source of truth: **git tags** (`vX.Y.Z`). The Neon `releases` table is a read-only mirror used by `/api/home` and the hover-card on `app/page.tsx`.

Workflow (driven by `.github/workflows/release-please.yml`):

1. Write commits using Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `feat!:` (breaking). Do **not** put a version in the subject (`feat(0.5.1): ...` style is deprecated).
2. On push to `main`, the `release-please` action opens or updates a PR titled `chore: release X.Y.Z`. It picks the bump from commit types (`fix` → patch, `feat` → minor, `!` / `BREAKING CHANGE` → major). The PR diff bumps `package.json` and appends to `CHANGELOG.md`.
3. Merge the Release PR. release-please creates the git tag `vX.Y.Z` and a GitHub Release.
4. The `sync-db` job runs `npm run sync:release`, which inserts a row into `releases` (`tag`, `version`, `released_at`, `commit_sha`, `notes`). Idempotent via `onConflictDoNothing` on `tag`.

Setup requirement: the repo Secret `DATABASE_URL` must be set in GitHub.

Releases schema in `lib/db/schema.ts`:
- `tag` (`vX.Y.Z`, unique)
- `version` (`X.Y.Z`, unique)
- `released_at`, `commit_sha`, `notes`, `created_at`

Use `Release` from `types/release.ts` (derived via `$inferSelect`) — don't redeclare in routes/components.

### Types

Domain types live in `types/` (e.g. `types/todo.ts`). Keep API response shapes and DB row types aligned here; don't redeclare them inline in routes or components.

## Environment

`.env` must define:

- `DATABASE_URL` — Neon Postgres connection string
- `BETTER_AUTH_SECRET` — random 32-byte base64 (`openssl rand -base64 32`)
- `BETTER_AUTH_URL` — base URL of the app (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL` — same as `BETTER_AUTH_URL`, exposed to the client for `authClient`
