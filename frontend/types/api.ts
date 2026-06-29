export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  stage?: string;
  funding_total?: number;
  employee_count?: number;
  founded_year?: number;
  hq_country?: string;
  logo_url?: string;
  is_unicorn: boolean;
  growth_score?: number;
  trending_score?: number;
  valuation?: number;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: string;
  bio?: string;
  logo_url?: string;
  hq_country?: string;
  founded_year?: number;
  sector_focus?: string;
  stage_focus?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  launch_date?: string;
  upvotes: number;
}

export interface Founder {
  id: string;
  name: string;
  title?: string;
  photo_url?: string;
}

export interface FundingRound {
  id: string;
  company_id?: string;
  company?: Company;
  round_type: string;
  amount?: number;
  date?: string;
  lead_investor_id?: string;
  lead_investor?: Investor;
  co_investors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
  error: null;
}

export interface SuccessResponse<T> {
  data: T;
  meta: any;
  error: null;
}
