# Portfolio

Full-stack engineer portfolio built with Next.js. The UI is an ops-console style surface; the `/lab` page exercises real APIs against Postgres.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn
- next-intl (pt-PT / en-EN)
- Postgres (Neon / Supabase / any) + Drizzle ORM + `postgres.js`
- jose (signed httpOnly session cookies)
- Zod validation + in-memory rate limits

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in:

- `DATABASE_URL` — Postgres URI (Neon or Supabase both work; add `?sslmode=require`)
- `SESSION_SECRET` — random string, at least 32 characters

Apply schema:

```bash
pnpm db:push
# or run drizzle/0000_init.sql in your SQL editor
```

```bash
pnpm dev
```

Without env vars the site still renders; lab widgets show error/empty states.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Local server |
| `pnpm build` / `pnpm start` | Production |
| `pnpm db:generate` | Generate migrations from schema |
| `pnpm db:push` | Push schema to Postgres |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Drizzle Studio |

## API surface

| Route | Notes |
|-------|-------|
| `GET /api/status` | Health + DB ping |
| `GET /api/metrics` | Latency aggregates |
| `GET/POST /api/guestbook` | Public read; POST needs session |
| `POST /api/contact` | Validated contact persistence |
| `GET/POST/DELETE /api/auth/session` | Demo cookie session |
| `GET /api/presence` + `/api/presence/stream` | Visitor count (SSE) |
| `GET/POST /api/playground/echo` | Rate-limited echo |

## Deploy (Vercel)

Set `DATABASE_URL` and `SESSION_SECRET` in the project env. Deploy as a standard Next.js app.
