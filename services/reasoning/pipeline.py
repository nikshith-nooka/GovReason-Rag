"""
Master GovReasonRAG Pipeline.
Implements the 14-stage Evidence-Contracted Policy Reasoning (ECPR) workflow.
"""

import json
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

from packages.shared_types.models import (
    CitizenContext,
    IntentType,
    DecisionStatus,
    ExplainableResponse,
    PolicyRule,
    PolicyEvaluationResult,
    Citation,
    AuthorityTier
)
from services.reasoning.contract_builder import EvidenceContractBuilder
from services.reasoning.coverage_engine import EvidenceCoverageEngine
from services.reasoning.rule_engine import PolicyRuleEngine
from services.reasoning.version_validator import PolicyVersionValidator
from services.reasoning.conflict_resolver import ConflictResolver
from services.reasoning.decision_engine import DecisionEngine
from services.reasoning.dead_link_recovery import DeadLinkRecoveryEngine
from services.retrieval.hybrid_retriever import HybridRetriever
from services.policy_graph.graph_engine import PolicyGraphEngine
from packages.config.llm_provider import get_llm_provider


class GovReasonRAGPipeline:
    def __init__(self, schemes_data_path: Optional[str] = None):
        if schemes_data_path:
            with open(schemes_data_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
                self.schemes = raw.get("schemes", [])
        else:
            self.schemes = []

        # Initialize Sub-Engines
        self.contract_builder = EvidenceContractBuilder(self.schemes)
        self.coverage_engine = EvidenceCoverageEngine()
        self.rule_engine = PolicyRuleEngine()
        self.version_validator = PolicyVersionValidator(self.schemes)
        self.conflict_resolver = ConflictResolver(self.schemes)
        self.decision_engine = DecisionEngine()
        self.link_recovery = DeadLinkRecoveryEngine()
        self.graph_engine = PolicyGraphEngine(self.schemes)
        self.llm = get_llm_provider()

        # Build corpus for hybrid retrieval
        corpus = []
        for s in self.schemes:
            corpus.append({
                "id": s["id"],
                "title": s["name"],
                "text": f"{s['name']}. Department: {s['department']}. Target: {s['target_group']}. Benefits: {s['benefits']}. Jurisdiction: {s['jurisdiction']}."
            })
        self.retriever = HybridRetriever(corpus)

    def extract_context_and_intent(self, query: str, provided_context: Optional[CitizenContext] = None) -> (IntentType, CitizenContext):
        ctx = provided_context.copy() if provided_context else CitizenContext(raw_query=query)
        q_lower = query.lower()

        # Extract Age
        age_match = re.search(r"(\d{1,2})[- ]*(?:years?[- ]*old|year|years|yo|yr|yrs|age)", q_lower)
        if age_match and ctx.age is None:
            ctx.age = int(age_match.group(1))

        # Extract Income
        income_match = re.search(r"(?:income|earning|salary)[^\d]*([\d\.]+)\s*(?:lakh|l|lac|k)", q_lower)
        if not income_match:
            income_match = re.search(r"₹?\s*([\d\.]+)\s*(?:lakh|l|lac)", q_lower)
        if income_match and ctx.annual_family_income is None:
            num = float(income_match.group(1))
            ctx.annual_family_income = num * 100000.0

        # Extract State / Domicile
        if "telangana" in q_lower or "hyderabad" in q_lower:
            ctx.state = "Telangana"
        elif "andhra" in q_lower:
            ctx.state = "Andhra Pradesh"

        # Extract Education
        if "engineering" in q_lower or "btech" in q_lower:
            ctx.education_level = "Engineering"
        elif "student" in q_lower or "college" in q_lower:
            ctx.education_level = "Graduation"

        # Determine Intent
        if "compare" in q_lower or "difference" in q_lower or "vs" in q_lower:
            intent = IntentType.POLICY_COMPARISON
        elif "document" in q_lower or "certificate" in q_lower:
            intent = IntentType.DOCUMENT_REQUIREMENT
        elif "timeline" in q_lower or "changed" in q_lower or "version" in q_lower or "amend" in q_lower:
            intent = IntentType.POLICY_TIMELINE_EVOLUTION
        elif "both" in q_lower or "simultaneously" in q_lower or "conflict" in q_lower:
            intent = IntentType.CONFLICT_VERIFICATION
        elif "what if" in q_lower or "increase" in q_lower:
            intent = IntentType.COUNTERFACTUAL_CHECK
        else:
            intent = IntentType.MULTI_POLICY_ELIGIBILITY if ("which schemes" in q_lower or "what schemes" in q_lower) else IntentType.ELIGIBILITY_CHECK

        return intent, ctx

    def run(self, query: str, provided_context: Optional[CitizenContext] = None) -> ExplainableResponse:
        # Stage 1 & 2: Intent & Context Extraction
        intent, context = self.extract_context_and_intent(query, provided_context)

        # Stage 3: Target Policy Identification & Hybrid Retrieval
        retrieved_items = self.retriever.retrieve_hybrid(query, top_k=4)
        target_policy_ids = [item["doc"]["id"] for item in retrieved_items]

        # Specific scheme targeting based on keywords
        q_lower = query.lower()
        if "pmay" in q_lower or "housing" in q_lower or "awas" in q_lower:
            if "PMAY_U" not in target_policy_ids:
                target_policy_ids.insert(0, "PMAY_U")
        if "scholarship" in q_lower or "epass" in q_lower or "student" in q_lower:
            if "TS_EPASS_POSTMETRIC" not in target_policy_ids:
                target_policy_ids.append("TS_EPASS_POSTMETRIC")
            if "NSP_CSSS" not in target_policy_ids:
                target_policy_ids.append("NSP_CSSS")
        if "kisan" in q_lower or "farmer" in q_lower:
            if "PM_KISAN" not in target_policy_ids:
                target_policy_ids.append("PM_KISAN")
        if "ayushman" in q_lower or "health" in q_lower or "pmjay" in q_lower:
            if "PM_JAY" not in target_policy_ids:
                target_policy_ids.append("PM_JAY")

        # Stage 4: Build Evidence Contract
        contract = self.contract_builder.build_contract(query, intent, target_policy_ids, context)

        # Stage 5 & 6: Source & Version Validation
        version_validations = {}
        for pid in target_policy_ids:
            active_ver = self.version_validator.get_active_version(pid)
            version_validations[pid] = active_ver

        # Stage 7 & 8: Evidence Coverage Assessment
        coverage = self.coverage_engine.calculate_coverage(contract)

        # Stage 9: Policy Rule Reasoning
        rule_evaluations = []
        for pid in target_policy_ids:
            scheme = next((s for s in self.schemes if s["id"] == pid), None)
            if scheme:
                rules = []
                for r in scheme.get("rules", []):
                    r_copy = dict(r)
                    r_copy.setdefault("policy_id", pid)
                    rules.append(PolicyRule(**r_copy))
                eval_res = self.rule_engine.evaluate_scheme_rules(pid, rules, context)
                rule_evaluations.append(eval_res)

        # Stage 10: Conflict Resolution
        conflict_state = self.conflict_resolver.detect_and_resolve(target_policy_ids, context)

        # Stage 11: Deterministic Decision Engine
        decision_state = self.decision_engine.evaluate_decision(
            intent=intent,
            coverage=coverage,
            rule_evaluations=rule_evaluations,
            conflict_state=conflict_state,
            schemes_meta=self.schemes,
            context=context
        )

        # Stage 12, 13, 14: Explainable Response Synthesis
        why_factors = []
        missing_factors = []
        citations: List[Citation] = []
        required_docs = set()
        next_steps = []

        for p_res in decision_state.results_by_policy:
            why_factors.extend([f"[{p_res.scheme_name}] {c}" for c in p_res.satisfied_conditions])
            if p_res.failed_conditions:
                why_factors.extend([f"[{p_res.scheme_name} Disqualification] {c}" for c in p_res.failed_conditions])
            missing_factors.extend([f"[{p_res.scheme_name}] {m}" for m in p_res.missing_information])
            citations.extend(p_res.citations)
            required_docs.update(p_res.required_documents)
            if p_res.official_application_url:
                next_steps.append(f"Apply directly on official portal: {p_res.official_application_url}")

        if conflict_state.conflict_detected:
            why_factors.append(f"Statutory Note: {conflict_state.explanation}")

        # Summary Synthesis
        if decision_state.primary_status == DecisionStatus.ELIGIBLE:
            summary = "Based on verified active policy guidelines, you meet the primary eligibility criteria for the evaluated scheme(s)."
        elif decision_state.primary_status == DecisionStatus.CONDITIONALLY_ELIGIBLE:
            summary = "You appear conditionally eligible for the identified scheme(s), subject to specific statutory constraints or quota verification."
        elif decision_state.primary_status == DecisionStatus.INSUFFICIENT_INFORMATION:
            summary = f"Insufficient evidence to authorize a final decision. Please provide: {', '.join(coverage.unmet_critical_parameters)}."
        else:
            summary = "Based on active official policy rules, you do not meet the mandatory criteria for one or more evaluated schemes."

        # Grounded Statutory Verbalization
        sat_str = ", ".join(why_factors[:3]) if why_factors else "None"
        mis_str = ", ".join(missing_factors[:3]) if missing_factors else "None"
        llm_prompt = f"Citizen Query: {query}\nStatutory Verdict: {decision_state.primary_status.value}\nSatisfied Factors: {sat_str}\nMissing Factors: {mis_str}\n\nWrite a helpful 2-sentence explanation to the citizen strictly based on the verified facts."
        try:
            verbalization = self.llm.generate(
                prompt=llm_prompt,
                system_prompt="You are GovReasonRAG, an authoritative Indian civic AI assistant. Provide a concise, polite citizen explanation strictly conforming to the verified facts."
            )
            if verbalization and len(verbalization.strip()) > 15:
                summary = verbalization.strip()
        except Exception:
            verbalization = None

        return ExplainableResponse(
            query=query,
            intent=intent,
            decision_summary=summary,
            results=decision_state.results_by_policy,
            why_factors=why_factors,
            missing_factors=missing_factors,
            policy_versions_used=[{"policy_id": k, "version": v.get("version_tag", "active")} for k, v in version_validations.items() if v],
            citations=citations,
            next_steps=list(set(next_steps)),
            required_documents=list(required_docs),
            research_trace={
                "contract_id": contract.contract_id,
                "total_obligations": coverage.total_obligations,
                "covered_obligations": coverage.covered_obligations,
                "critical_coverage_pct": coverage.critical_coverage_percentage,
                "decision_authorized": coverage.decision_authorized,
                "conflict_detected": conflict_state.conflict_detected,
                "resolution_strategy": conflict_state.resolution_strategy,
                "overall_confidence": decision_state.overall_confidence,
                "llm_verbalization": verbalization
            }
        )
