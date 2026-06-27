/**
 * Domain model TypeScript interfaces
 *
 * These mirror the Postgres table columns 1:1 so the compiler catches
 * mismatches between what the DB returns and what the code expects.
 *
 * Arrays (stage_focus, sector_focus, co_investors, related_company_ids)
 * are represented as T[] — Supabase JS returns Postgres arrays as JS arrays.
 */

// ─── Core domain types ────────────────────────────────────────────────────────

export type CompanyStage =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'series-c'
  | 'series-d+'
  | 'growth'
  | 'public'
  | 'acquired';

export type InvestorType = 'VC' | 'Angel' | 'Corporate' | 'Family Office' | 'Sovereign';

export type RelationshipType = 'competitor' | 'partner' | 'acquisition';

export type RoundType =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'series-c'
  | 'series-d'
  | 'growth'
  | 'ipo'
  | 'grant'
  | 'convertible-note'
  | 'spac';

// ─── Table row shapes ─────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  funding_total: number | null;       // USD cents
  employee_count: number | null;
  founded_year: number | null;
  hq_city: string | null;
  hq_country: string | null;
  logo_url: string | null;
  website: string | null;
  stage: CompanyStage | null;
  is_unicorn: boolean;
  valuation: number | null;           // USD cents
  growth_score: number | null;        // 0-100
  last_scraped_at: string | null;     // ISO-8601
  data_confidence_score: number | null; // 0.00-1.00
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: InvestorType;
  bio: string | null;
  aum: number | null;                 // USD cents
  portfolio_count: number | null;
  stage_focus: string[];
  sector_focus: string[];
  location: string | null;
  logo_url: string | null;
  avg_check_size: number | null;      // USD cents
  fund_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: RoundType;
  amount: number | null;              // USD cents
  currency: string;                   // ISO 4217, default 'USD'
  date: string | null;               // ISO-8601 date
  lead_investor_id: string | null;
  co_investors: string[];             // array of investor IDs
  created_at: string;
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  company_id: string;
  bio: string | null;
  twitter: string | null;
  linkedin: string | null;
  location: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  category: string | null;
  launch_date: string | null;        // ISO-8601 date
  upvotes: number;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string | null;       // ISO-8601
  source: string | null;
  tag: string | null;
  related_company_ids: string[];
  summary: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CompanyRelationship {
  id: string;
  company_id: string;
  related_company_id: string;
  relationship_type: RelationshipType;
  created_at: string;
}

// ─── Enriched / joined shapes returned by the API ────────────────────────────

export interface CompanyProfile extends Company {
  founders: Founder[];
  products: Product[];
  funding_rounds: FundingRound[];
  relationships: CompanyRelationship[];
}

export interface CompanyGraph {
  company: Company;
  investors: Investor[];
  co_investors: Investor[];
  competitors: Company[];
  partners: Company[];
  acquired: Company[];
  products: Product[];
}

// ─── Pagination meta ─────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Standard API response envelope ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T | null;
  meta: Record<string, unknown>;
  error: { code: string; message: string } | null;
}
