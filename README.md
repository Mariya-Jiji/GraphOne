# GraphOne Backend API

REST API for **GraphOne** — an AI startup intelligence platform tracking AI companies, investors, funding rounds, founders, products, and news. Built as part of The AI Signal's engineering trial task.

## Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (Postgres)
- **Validation:** Zod
- **Caching:** Custom in-memory TTL cache (no external dependency)

## Local Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd graphone-backend
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

3. Run the SQL migration in your Supabase project's SQL Editor:
   ```
   migrations/001_initial_schema.sql
   ```

4. Seed the database with realistic AI ecosystem data:
   ```bash
   npm run seed
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`. Health check: `GET /health`

## Folder Structure

```
src/
  app.ts             — Express middleware pipeline + router mounting
  server.ts          — Environment validation, server startup, graceful shutdown
  routes/            — Route declarations only (path → controller mapping)
  controllers/       — Business logic: parsing, querying, formatting responses
  schemas/           — Zod validation schemas for inputs
  models/types.ts    — TypeScript interfaces mirroring the Postgres schema
  middleware/        — API key guard, rate limiter, response wrapper, error handler
  utils/             — AppError class, in-memory TTL cache
  db/                — Supabase client singleton
migrations/          — SQL schema migration
scripts/seed.ts      — Database seed script
```

**Design principle:** routes contain no logic, controllers contain no raw data access, and Zod schemas enforce the boundary between client input and application code.

## API Endpoints

### Companies
- `GET /companies` — list with filters (category, stage, country, sort)
- `GET /companies/:slug` — full profile with relations
- `GET /companies/:slug/funding` — funding rounds timeline
- `GET /companies/:slug/products` — company's products
- `GET /companies/trending` — top 10 by Trending Score (see below)
- `GET /companies/:slug/graph` — 1-hop ecosystem graph
- `POST /companies` — create company (requires API key)

### Investors
- `GET /investors` — list with filters (type, stage_focus, sector)
- `GET /investors/:slug` — full profile + portfolio breakdown
- `GET /investors/:slug/investments` — paginated investment history
- `GET /investors/most-active` — ranked by deal count (last 90 days)
- `GET /investors/:slug/co-investors` — frequent co-investment partners

### Search & Utility
- `GET /search?q=` — cross-entity search (companies, investors, founders, products)
- `GET /stats` — platform aggregate stats (cached, 5-min TTL)
- `GET /founders/:slug` — founder profile with linked company

## Schema Decisions

- **Money as BIGINT (USD cents):** avoids floating-point rounding errors. Divide by 100 to display dollar values.
- **Denormalized arrays** (`stage_focus`, `sector_focus`, `co_investors`) instead of junction tables: these fields are read-heavy and rarely updated, so avoiding extra JOINs improves read performance.
- **TEXT CHECK constraints instead of ENUMs** for `stage`/`round_type`: CHECK constraints can be altered without a schema-locking `ALTER TYPE`, making future changes easier.
- **Computed `growth_score` column:** allows simple `ORDER BY` for one signal, separate from the dynamic Trending Score described below.

## Trending Score Algorithm

`GET /companies/trending` uses a custom-weighted formula instead of a single static metric:

```
trending_score = 
  (0.35 × funding_recency_score) + 
  (0.30 × news_activity_score) + 
  (0.20 × product_engagement_score) + 
  (0.15 × growth_efficiency_score)
```

- **Funding Recency (35%):** exponential decay based on days since the company's most recent funding round — a raise today scores ~100, decaying toward 0 over ~1.5 years. The highest weight, since a recent raise is the strongest real-time momentum signal.
- **News Activity (30%):** count of news articles mentioning the company in the last 90 days, scaled to 0–100.
- **Product Engagement (20%):** sum of upvotes across the company's products, log-scaled to prevent a few high-upvote outliers from dominating the ranking.
- **Growth Efficiency (15%):** employee count normalized by company age, rewarding fast-scaling young companies over large companies that are simply old.

**Why this beats a static score:** in testing, DeepSeek ranks above OpenAI on `/companies/trending` despite OpenAI having a higher static `growth_score` and far more total funding — because DeepSeek's more recent funding round and news spike reflect current momentum, not historical size.

### Known Limitations
- **News sentiment is not considered.** A negative story (e.g. a lawsuit or leadership departure) currently counts the same as positive coverage (e.g. a funding announcement). A more complete version would weight articles using sentiment analysis or the existing `tag` field (e.g. treating "Funding"/"Product"/"Partnership" as positive signals).
- **No social media signal.** The score doesn't incorporate Twitter/X mentions or search trend volume, which would require additional data sources not currently in the schema.

## Caching Strategy

`/companies/trending` (60s TTL) and `/stats` (5-min TTL) use a lightweight, dependency-free in-memory `Map`-based cache with TTL eviction — avoiding the need for Redis at this scale. Limitation: this cache is per-instance and wouldn't be shared across multiple server replicas in a horizontally scaled deployment.

## What Would You Build Next With 2 More Days?

1. **Sentiment-aware Trending Score** — integrate a lightweight sentiment classifier on news articles so negative coverage doesn't inflate a company's trending ranking.
2. **Real-time data ingestion** — a scheduled job to actually scrape/update `last_scraped_at` and refresh company metrics instead of static seed data.
3. **Full-text search with ranking** — replace `.ilike()` substring search with Postgres full-text search (`tsvector`) for better relevance ranking on `/search`.
4. **GraphQL layer or batched endpoints** — to reduce the number of round-trips the frontend needs for densely nested pages like the Company Detail view.
