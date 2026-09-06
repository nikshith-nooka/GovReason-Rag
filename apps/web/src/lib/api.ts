"use client";

export interface CitizenProfile {
  age?: number;
  state?: string;
  district?: string;
  annual_family_income?: number;
  occupation?: string;
  education_level?: string;
  social_category?: string;
  gender?: string;
  disability_status?: boolean;
  land_holding_acres?: number;
  location_type?: string;
  pucca_house_owned?: boolean;
  raw_query?: string;
  [key: string]: any;
}

export interface PolicyVersion {
  policy_id: string;
  version: string;
  effective_date?: string;
}

export interface Citation {
  title: string;
  clause_text: string;
  version_tag: string;
  source_url?: string;
}

export interface SchemeResult {
  scheme_id: string;
  scheme_name: string;
  decision: "ELIGIBLE" | "INELIGIBLE" | "CONDITIONALLY_ELIGIBLE" | "INSUFFICIENT_INFORMATION";
  benefits_summary?: string;
  satisfied_conditions: string[];
  failed_conditions: string[];
  missing_information?: string[];
  official_application_url?: string;
  citations?: Citation[];
  required_documents?: string[];
}

export interface ResearchTrace {
  [key: string]: any;
  contract_id?: string;
  total_obligations?: number;
  covered_obligations?: number;
  critical_coverage_pct?: number;
  decision_authorized?: boolean;
  conflict_detected?: boolean;
  resolution_strategy?: string;
  overall_confidence?: number;
  llm_verbalization?: string;
}

export interface ExplainableResponse {
  query: string;
  intent?: string;
  decision_summary: string;
  natural_language_explanation?: string;
  results: SchemeResult[];
  why_factors: string[];
  missing_factors?: string[];
  citations: Citation[];
  required_documents: string[];
  next_steps?: string[];
  policy_versions_used: PolicyVersion[];
  research_trace?: ResearchTrace;
}

export async function chatWithAssistant(
  query: string,
  profile: CitizenProfile = {}
): Promise<ExplainableResponse> {
  const res = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      citizen_context: {
        raw_query: query,
        ...profile,
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function checkStructuredEligibility(
  profile: CitizenProfile
): Promise<ExplainableResponse> {
  const query = `Evaluate overall scheme eligibility for citizen in ${profile.state || 'India'}, age ${profile.age || 'unspecified'}, income ₹${profile.annual_family_income || 'unspecified'}, occupation ${profile.occupation || 'unspecified'}.`;
  const res = await fetch("http://localhost:8000/api/eligibility/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raw_query: query,
      ...profile,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
