# GraphOne API

> Bloomberg for AI Startups — a production-grade REST API tracking AI companies, investors, funding rounds, founders, products, and news.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Language | TypeScript 5 (strict) |
| Database | Supabase (Postgres 15) |
| Validation | Zod |
| Rate limiting | express-rate-limit |
| Security | helmet, cors |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, API_KEY

# 3. Run the SQL migration in your Supabase SQL Editor
#    (Dashboard → SQL Editor → New query → paste migrations/001_initial_schema.sql)

# 4. Seed the database (50+ companies, 20+ investors, 100+ news items)
npm run seed

# 5. Start dev server
npm run dev
```

The server starts at **http://localhost:3000**

---

## Project Structure

```
src/
├── app.ts                     # Express app factory (middleware stack)
├── server.ts                  # HTTP entry point + graceful shutdown
├── routes/
│   └── companies.routes.ts    # Route declarations only
├── controllers/
│   └── companies.controller.ts # All request handling + DB queries
├── models/
│   └── types.ts               # TypeScript interfaces for all domain types
├── db/
│   └── index.ts               # Supabase client singleton
├── middleware/
│   ├── auth.middleware.ts     # X-API-Key guard for write routes
│   ├── errorHandler.middleware.ts  # Centralised error → JSON conversion
│   ├── rateLimiter.middleware.ts   # 100 req/min per IP
│   └── responseWrapper.ts    # Attaches res.success() and res.paginate()
├── schemas/
│   └── company.schema.ts     # Zod schemas + parse helpers
└── utils/
    ├── AppError.ts            # Typed error class with code + statusCode
    └── cache.ts               # In-memory TTL cache (Map-based, no deps)

migrations/
└── 001_initial_schema.sql    # Full DDL — run once in Supabase

scripts/
└── seed.ts                   # Realistic seed data (ts-node)
```

---

## API Response Envelope

Every endpoint returns this shape:

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-10-02T12:00:00.000Z",
    "path": "/companies/openai"
  },
  "error": null
}
```

Paginated list endpoints include:

```json
{
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1, "limit": 20, "total": 54,
      "totalPages": 3, "hasNext": true, "hasPrev": false
    }
  }
}
```

Error responses:

```json
{
  "data": null,
  "meta": {},
  "error": { "code": "NOT_FOUND", "message": "Company 'xyz' not found" }
}
```

---

## Companies Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/companies` | — | List with filters + sort + pagination |
| GET | `/companies/trending` | — | Top 10 by growth score (60s cache) |
| GET | `/companies/:slug` | — | Full profile with founders, products, rounds |
| GET | `/companies/:slug/funding` | — | Funding rounds with enriched investor data |
| GET | `/companies/:slug/products` | — | Products sorted by upvotes |
| GET | `/companies/:slug/graph` | — | 1-hop ecosystem: investors, competitors, products |
| POST | `/companies` | X-API-Key | Create a company (Zod validated) |

### Query Parameters — `GET /companies`

| Param | Type | Description |
|---|---|---|
| `category` | string | Filter by category (partial match) |
| `stage` | enum | `pre-seed` / `seed` / `series-a` … / `public` |
| `country` | string | Filter by `hq_country` (partial match) |
| `sort` | enum | `trending` / `funded` / `new` (default: `new`) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page, max 100 (default: 20) |

### `POST /companies` Body

```json
{
  "name": "Acme AI",
  "description": "...",
  "category": "LLM",
  "stage": "seed",
  "hq_city": "San Francisco",
  "hq_country": "USA",
  "website": "https://acme.ai",
  "founded_year": 2024,
  "is_unicorn": false
}
```

Requires header: `X-API-Key: <your API_KEY>`

---

## Schema Decisions

### Money as integers (USD cents)
All monetary columns (`funding_total`, `valuation`, `amount`, `aum`, `avg_check_size`) are stored as `BIGINT` representing **USD cents**. Divide by 100 in your display layer. This avoids floating-point precision bugs.

### Arrays for denormalised data
`co_investors UUID[]`, `stage_focus TEXT[]`, `related_company_ids UUID[]` use native Postgres arrays. GIN indexes on `stage_focus`, `sector_focus`, and `related_company_ids` enable efficient `@>` (contains) queries.

### CHECK constraints over PG ENUMs
`stage`, `round_type`, `relationship_type`, and `investor.type` use `TEXT CHECK (... IN (...))` instead of `CREATE TYPE`. Adding a new value is a simple `ALTER TABLE ... DROP CONSTRAINT / ADD CONSTRAINT` with no DDL lock.

### auto-updated `updated_at`
A single `trigger_set_updated_at()` trigger function is reused across all tables so application code never has to manually set `updated_at`.

### Row Level Security
RLS is enabled on all tables with public read policies. The API uses the `service_role` key which bypasses RLS entirely, so these policies only apply if you ever use the `anon` key in a frontend client.

---

## Middleware Stack Order

1. `helmet` — security headers
2. `cors` — allow cross-origin requests
3. `rateLimiter` — 100 req/min per IP (returns early on breach)
4. `morgan` — request logging
5. `express.json()` — body parsing
6. `responseWrapper` — attaches `res.success()` / `res.paginate()`
7. **Routes**
8. `notFoundHandler` — 404 for unmatched routes
9. `errorHandler` — converts all errors to JSON envelope

---

## Caching

The `/companies/trending` endpoint uses an in-memory TTL cache (`src/utils/cache.ts`) with a **60-second TTL**. The cache is a `Map<string, { value, expiresAt }>` with lazy eviction on read and a periodic sweep every 60 seconds to prevent memory growth. No external dependency needed.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | Service-role secret key |
| `API_KEY` | ✅ | Secret for `X-API-Key` header on write routes |
| `PORT` | — | HTTP port (default: 3000) |
| `NODE_ENV` | — | `development` / `production` |
| `CORS_ORIGIN` | — | Allowed origin (default: `*`) |
