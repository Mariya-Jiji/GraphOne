import { Company, PaginatedResponse, SuccessResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchCompanies(params?: Record<string, string>): Promise<PaginatedResponse<Company>> {
  const url = new URL(`${API_BASE_URL}/companies`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 } // Cache for 60s
  });

  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }

  return res.json();
}

export async function fetchTrendingCompanies(): Promise<SuccessResponse<Company[]>> {
  const res = await fetch(`${API_BASE_URL}/companies/trending`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch trending companies');
  }

  return res.json();
}

export async function fetchCompanyFunding(slug: string): Promise<SuccessResponse<any>> {
  const res = await fetch(`${API_BASE_URL}/companies/${slug}/funding`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch funding for company: ${slug}`);
  }

  return res.json();
}

export async function fetchCompanyProfile(slug: string): Promise<SuccessResponse<any>> {
  const res = await fetch(`${API_BASE_URL}/companies/${slug}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile for company: ${slug}`);
  }

  return res.json();
}

export async function fetchCompanyProducts(slug: string): Promise<SuccessResponse<any>> {
  const res = await fetch(`${API_BASE_URL}/companies/${slug}/products`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products for company: ${slug}`);
  }

  return res.json();
}

export async function fetchCompanyGraph(slug: string): Promise<SuccessResponse<any>> {
  const res = await fetch(`${API_BASE_URL}/companies/${slug}/graph`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch graph for company: ${slug}`);
  }

  return res.json();
}
