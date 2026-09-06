"""
Core Pydantic models and schemas for GovReasonRAG (Evidence-Contracted Policy Reasoning).
"""

from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import date, datetime
from enum import Enum


class IntentType(str, Enum):
    ELIGIBILITY_CHECK = "eligibility_check"
    MULTI_POLICY_ELIGIBILITY = "multi_policy_eligibility"
    POLICY_COMPARISON = "policy_comparison"
    POLICY_INFORMATION = "policy_information"
    DOCUMENT_REQUIREMENT = "document_requirement"
    POLICY_TIMELINE_EVOLUTION = "policy_timeline_evolution"
    CONFLICT_VERIFICATION = "conflict_verification"
    COUNTERFACTUAL_CHECK = "counterfactual_check"


class DecisionStatus(str, Enum):
    ELIGIBLE = "ELIGIBLE"
    CONDITIONALLY_ELIGIBLE = "CONDITIONALLY_ELIGIBLE"
    INELIGIBLE = "INELIGIBLE"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"
    CONFLICT_UNRESOLVED = "CONFLICT_UNRESOLVED"


class ObligationStatus(str, Enum):
    SATISFIED = "SATISFIED"
    FAILED = "FAILED"
    MISSING = "MISSING"
    CONTRADICTORY = "CONTRADICTORY"


class RuleConfidence(str, Enum):
    HUMAN_VERIFIED = "HUMAN_VERIFIED"
    MACHINE_EXTRACTED = "MACHINE_EXTRACTED"
    UNCERTAIN = "UNCERTAIN"


class AuthorityTier(str, Enum):
    TIER_1_CENTRAL_GAZETTE = "TIER_1_CENTRAL_GAZETTE"
    TIER_1_STATE_GAZETTE = "TIER_1_STATE_GAZETTE"
    TIER_1_MINISTRY_PORTAL = "TIER_1_MINISTRY_PORTAL"
    TIER_2_GOV_AGGREGATOR = "TIER_2_GOV_AGGREGATOR"
    TIER_3_SECONDARY_SOURCE = "TIER_3_SECONDARY_SOURCE"


class PolicyStatus(str, Enum):
    ACTIVE = "active"
    AMENDED = "amended"
    SUPERSEDED = "superseded"
    EXPIRED = "expired"
    DRAFT = "draft"


# 1. Citizen Profile & Context
class CitizenContext(BaseModel):
    citizen_id: Optional[str] = None
    age: Optional[int] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_family_income: Optional[float] = None
    occupation: Optional[str] = None
    education_level: Optional[str] = None
    social_category: Optional[str] = None  # e.g., General, SC, ST, OBC, EWS
    gender: Optional[str] = None
    disability_status: Optional[bool] = False
    land_holding_acres: Optional[float] = 0.0
    location_type: Optional[str] = "urban"
    pucca_house_owned: Optional[bool] = False
    is_artisan: Optional[bool] = False
    trade_name: Optional[str] = None
    monthly_electricity_units: Optional[float] = None
    has_rooftop_solar: Optional[bool] = False
    is_pregnant: Optional[bool] = False
    child_age: Optional[int] = None
    business_loan_amount: Optional[float] = None
    as_of_date: Optional[str] = None
    existing_schemes_enrolled: List[str] = Field(default_factory=list)
    raw_query: Optional[str] = ""
    custom_attributes: Dict[str, Any] = Field(default_factory=dict)

    def __getattr__(self, item: str) -> Any:
        if item in self.__dict__:
            return self.__dict__[item]
        if "custom_attributes" in self.__dict__ and item in self.__dict__["custom_attributes"]:
            return self.__dict__["custom_attributes"][item]
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{item}'")


# 2. Evidence Contract Research Model
class EvidenceObligation(BaseModel):
    obligation_id: str
    parameter_name: str  # e.g. "age", "annual_income", "domicile", "category"
    description: str
    critical: bool = True  # If critical evidence is missing, decision CANNOT be finalized
    required_operator: Optional[str] = None  # e.g. "<=", ">=", "==", "IN", "NOT_IN"
    target_value: Optional[Any] = None
    status: ObligationStatus = ObligationStatus.MISSING
    retrieved_value: Optional[Any] = None
    supporting_clause_id: Optional[str] = None
    citation_id: Optional[str] = None
    notes: Optional[str] = None


class EvidenceContract(BaseModel):
    contract_id: str
    intent: IntentType
    target_policy_ids: List[str] = Field(default_factory=list)
    obligations: List[EvidenceObligation] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None


# 3. Evidence Coverage Research Model
class EvidenceCoverage(BaseModel):
    total_obligations: int = 0
    covered_obligations: int = 0
    missing_obligations: int = 0
    critical_total: int = 0
    critical_covered: int = 0
    critical_missing: int = 0
    coverage_percentage: float = 0.0
    critical_coverage_percentage: float = 0.0
    decision_authorized: bool = False  # True ONLY if 100% of critical obligations are satisfied/evaluated
    unmet_critical_parameters: List[str] = Field(default_factory=list)
    recommendation: Literal["PROCEED_TO_REASONING", "REQUEST_MORE_CITIZEN_INFO", "ABSTAIN"] = "PROCEED_TO_REASONING"


# 4. Policy Rule & AST Schema
class PolicyRule(BaseModel):
    rule_id: str
    policy_id: str
    parameter: str
    operator: str  # "<=", ">=", "==", "!=", "IN", "NOT_IN", "CONTAINS"
    threshold_value: Any
    unit: Optional[str] = None
    is_mandatory: bool = True
    clause_reference: str
    exceptions: List[str] = Field(default_factory=list)
    confidence: RuleConfidence = RuleConfidence.HUMAN_VERIFIED


# 5. Citation & Provenance
class Citation(BaseModel):
    citation_id: str
    source_id: str
    title: str
    authority: str
    authority_tier: AuthorityTier = AuthorityTier.TIER_1_MINISTRY_PORTAL
    url: str
    is_url_active: bool = True
    recovered_mirror_url: Optional[str] = None
    version_tag: str
    page_number: Optional[int] = None
    section: Optional[str] = None
    clause_text: str
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None


# 6. Policy Version Model
class PolicyVersion(BaseModel):
    policy_id: str
    scheme_code: str
    title: str
    version_tag: str  # e.g., "v2024.1", "v2021"
    authority: str
    jurisdiction: str  # "Central", "Telangana", "All India"
    published_date: str
    effective_from: str
    effective_to: Optional[str] = None
    status: PolicyStatus = PolicyStatus.ACTIVE
    source_url: str
    document_hash: str
    supersedes_version: Optional[str] = None
    amended_by: Optional[str] = None
    change_summary: Optional[str] = None


# 7. Conflict Model
class ConflictState(BaseModel):
    conflict_detected: bool = False
    conflicting_policy_ids: List[str] = Field(default_factory=list)
    conflicting_clauses: List[Dict[str, Any]] = Field(default_factory=list)
    resolution_strategy: Optional[str] = None  # "AUTHORITY_HIERARCHY", "TEMPORAL_RECENCY", "SPECIALIZED_JURISDICTION", "UNRESOLVED"
    resolved: bool = False
    explanation: Optional[str] = None


# 8. Decision State (Deterministic outcome before LLM generation)
class PolicyEvaluationResult(BaseModel):
    policy_id: str
    scheme_name: str
    decision: DecisionStatus
    confidence_score: float = 0.0
    satisfied_conditions: List[str] = Field(default_factory=list)
    failed_conditions: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    required_documents: List[str] = Field(default_factory=list)
    benefits_summary: Optional[str] = None
    citations: List[Citation] = Field(default_factory=list)
    official_application_url: Optional[str] = None


class DecisionState(BaseModel):
    primary_status: DecisionStatus
    intent: IntentType
    overall_confidence: float = 0.0
    results_by_policy: List[PolicyEvaluationResult] = Field(default_factory=list)
    coverage: EvidenceCoverage
    conflict_state: Optional[ConflictState] = None
    missing_citizen_fields: List[str] = Field(default_factory=list)


# 9. Final Citizen-Facing Response
class ExplainableResponse(BaseModel):
    query: str
    intent: IntentType
    decision_summary: str
    results: List[PolicyEvaluationResult] = Field(default_factory=list)
    why_factors: List[str] = Field(default_factory=list)
    missing_factors: List[str] = Field(default_factory=list)
    policy_versions_used: List[Dict[str, str]] = Field(default_factory=list)
    citations: List[Citation] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
    required_documents: List[str] = Field(default_factory=list)
    research_trace: Dict[str, Any] = Field(default_factory=dict)
    generated_at: datetime = Field(default_factory=datetime.utcnow)
