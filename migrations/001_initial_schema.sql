-- ============================================================================
-- GraphOne — Initial Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================
-- 
-- Design decisions documented inline.
-- All money columns are stored as BIGINT (USD cents) to avoid floating-point
-- representation errors.  Display layer converts: cents / 100.
--
-- Arrays (TEXT[], UUID[]) are used for denormalised one-to-many reads that
-- don't need to be filtered.  For filterable arrays (stage_focus, sector_focus)
-- GIN indexes allow Postgres @> (contains) queries efficiently.
-- ============================================================================

-- Enable uuid generation (available by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM-like CHECK constraints ─────────────────────────────────────────────
-- We use CHECK constraints rather than CREATE TYPE enums because:
--   a) Adding a new value to a PG enum requires ALTER TYPE (a DDL lock)
--   b) CHECK constraints can be altered freely

-- ─── companies ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS companies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  description           TEXT,
  category              TEXT,                         -- e.g. "LLM", "Vision", "Code AI"
  funding_total         BIGINT,                       -- USD cents
  employee_count        INTEGER,
  founded_year          SMALLINT CHECK (founded_year BETWEEN 1900 AND 2100),
  hq_city               TEXT,
  hq_country            TEXT,
  logo_url              TEXT,
  website               TEXT,
  stage                 TEXT CHECK (
                          stage IN (
                            'pre-seed', 'seed', 'series-a', 'series-b',
                            'series-c', 'series-d+', 'growth', 'public', 'acquired'
                          )
                        ),
  is_unicorn            BOOLEAN NOT NULL DEFAULT FALSE,
  valuation             BIGINT,                       -- USD cents
  growth_score          NUMERIC(5,2) CHECK (growth_score BETWEEN 0 AND 100),
  last_scraped_at       TIMESTAMPTZ,
  data_confidence_score NUMERIC(3,2) CHECK (data_confidence_score BETWEEN 0 AND 1),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: fast slug lookups (also enforced by UNIQUE, but named for clarity)
CREATE INDEX IF NOT EXISTS idx_companies_slug        ON companies (slug);
-- Index: filtered list queries
CREATE INDEX IF NOT EXISTS idx_companies_category    ON companies (category);
CREATE INDEX IF NOT EXISTS idx_companies_stage       ON companies (stage);
CREATE INDEX IF NOT EXISTS idx_companies_hq_country  ON companies (hq_country);
-- Index: sort queries
CREATE INDEX IF NOT EXISTS idx_companies_growth_score ON companies (growth_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_companies_funding_total ON companies (funding_total DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_companies_created_at  ON companies (created_at DESC);
-- Index: composite for the common filter+sort combo
CREATE INDEX IF NOT EXISTS idx_companies_filter_sort
  ON companies (category, stage, hq_country, growth_score DESC NULLS LAST);


-- ─── investors ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS investors (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  type             TEXT NOT NULL DEFAULT 'VC' CHECK (
                     type IN ('VC', 'Angel', 'Corporate', 'Family Office', 'Sovereign')
                   ),
  bio              TEXT,
  aum              BIGINT,                            -- USD cents (Assets Under Management)
  portfolio_count  INTEGER,
  stage_focus      TEXT[] NOT NULL DEFAULT '{}',     -- e.g. ['seed', 'series-a']
  sector_focus     TEXT[] NOT NULL DEFAULT '{}',     -- e.g. ['AI', 'SaaS', 'Fintech']
  location         TEXT,
  logo_url         TEXT,
  avg_check_size   BIGINT,                            -- USD cents
  fund_number      SMALLINT,                          -- e.g. 4 for "Fund IV"
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GIN index enables efficient @> (array contains) queries
-- e.g. WHERE stage_focus @> ARRAY['seed']
CREATE INDEX IF NOT EXISTS idx_investors_stage_focus  ON investors USING GIN (stage_focus);
CREATE INDEX IF NOT EXISTS idx_investors_sector_focus ON investors USING GIN (sector_focus);
CREATE INDEX IF NOT EXISTS idx_investors_slug         ON investors (slug);


-- ─── funding_rounds ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS funding_rounds (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  round_type        TEXT NOT NULL CHECK (
                      round_type IN (
                        'pre-seed', 'seed', 'series-a', 'series-b', 'series-c',
                        'series-d', 'growth', 'ipo', 'grant', 'convertible-note', 'spac'
                      )
                    ),
  amount            BIGINT,                           -- USD cents
  currency          CHAR(3) NOT NULL DEFAULT 'USD',   -- ISO 4217
  date              DATE,
  lead_investor_id  UUID REFERENCES investors(id) ON DELETE SET NULL,
  -- co_investors is denormalised for read performance on list views.
  -- The data is not independently queryable (no GIN index) — the graph
  -- endpoint fetches all unique IDs and does a bulk IN() lookup.
  co_investors      UUID[] NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: most common query pattern — all rounds for a company, newest first
CREATE INDEX IF NOT EXISTS idx_funding_rounds_company_date
  ON funding_rounds (company_id, date DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_lead_investor
  ON funding_rounds (lead_investor_id);


-- ─── founders ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS founders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT,                                    -- e.g. "CEO & Co-founder"
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  bio        TEXT,
  twitter    TEXT,
  linkedin   TEXT,
  location   TEXT,
  photo_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_founders_company ON founders (company_id);
CREATE INDEX IF NOT EXISTS idx_founders_slug    ON founders (slug);


-- ─── products ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  launch_date  DATE,
  upvotes      INTEGER NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
  website_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_company  ON products (company_id);
CREATE INDEX IF NOT EXISTS idx_products_upvotes  ON products (upvotes DESC);


-- ─── news_articles ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS news_articles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                TEXT NOT NULL,
  url                  TEXT NOT NULL UNIQUE,
  published_at         TIMESTAMPTZ,
  source               TEXT,
  tag                  TEXT,
  -- GIN-indexed array: enables WHERE related_company_ids @> ARRAY[<company_id>]
  related_company_ids  UUID[] NOT NULL DEFAULT '{}',
  summary              TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at       ON news_articles (published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_news_related_companies  ON news_articles USING GIN (related_company_ids);
CREATE INDEX IF NOT EXISTS idx_news_tag                ON news_articles (tag);


-- ─── tags ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);


-- ─── company_relationships ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS company_relationships (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  related_company_id   UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  relationship_type    TEXT NOT NULL CHECK (
                         relationship_type IN ('competitor', 'partner', 'acquisition')
                       ),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate edges for the same direction + type
  CONSTRAINT uq_company_relationship UNIQUE (company_id, related_company_id, relationship_type),

  -- A company cannot have a relationship with itself
  CONSTRAINT chk_no_self_relationship CHECK (company_id != related_company_id)
);

CREATE INDEX IF NOT EXISTS idx_company_relationships_company
  ON company_relationships (company_id);
CREATE INDEX IF NOT EXISTS idx_company_relationships_related
  ON company_relationships (related_company_id);
CREATE INDEX IF NOT EXISTS idx_company_relationships_type
  ON company_relationships (relationship_type);


-- ─── updated_at auto-maintenance trigger ─────────────────────────────────────
-- Automatically sets updated_at on every UPDATE so application code never
-- has to remember to set it.

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE TRIGGER trg_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE TRIGGER trg_founders_updated_at
  BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────
-- Enable RLS on all tables.  The API uses the service-role key which bypasses
-- RLS, so these policies only matter if you ever use the anon key (e.g. in a
-- future client-side Supabase client).

ALTER TABLE companies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds        ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_relationships ENABLE ROW LEVEL SECURITY;

-- Public read-only policies (all tables are publicly readable)
CREATE POLICY "Public read companies"             ON companies             FOR SELECT USING (true);
CREATE POLICY "Public read investors"             ON investors             FOR SELECT USING (true);
CREATE POLICY "Public read funding_rounds"        ON funding_rounds        FOR SELECT USING (true);
CREATE POLICY "Public read founders"              ON founders              FOR SELECT USING (true);
CREATE POLICY "Public read products"              ON products              FOR SELECT USING (true);
CREATE POLICY "Public read news_articles"         ON news_articles         FOR SELECT USING (true);
CREATE POLICY "Public read tags"                  ON tags                  FOR SELECT USING (true);
CREATE POLICY "Public read company_relationships" ON company_relationships FOR SELECT USING (true);
