"""
Deterministic Decision Engine for GovReasonRAG.
Evaluates the structured output of the Evidence Coverage, Rule Engine, and Conflict Resolver
to assign the authoritative decision state before natural language explanation synthesis.
"""

from typing import List, Dict, Any
from packages.shared_types.models import (
    DecisionStatus,
    DecisionState,
    PolicyEvaluationResult,
    EvidenceCoverage,
    ConflictState,
    Citation,
    IntentType,
    PolicyRule,
    CitizenContext
)


class DecisionEngine:
    def evaluate_decision(
        self,
        intent: IntentType,
        coverage: EvidenceCoverage,
        rule_evaluations: List[Dict[str, Any]],
        conflict_state: ConflictState,
        schemes_meta: List[Dict[str, Any]],
        context: CitizenContext
    ) -> DecisionState:
        # We populate results_by_policy regardless so citizens can view
        # policy-by-policy compliance breakdown even when some fields require clarification.

        policy_results: List[PolicyEvaluationResult] = []
        statuses: List[DecisionStatus] = []

        for eval_res in rule_evaluations:
            pid = eval_res["policy_id"]
            scheme = next((s for s in schemes_meta if s["id"] == pid), {})
            
            # Formulate citations
            citations = []
            for c in scheme.get("citations", []):
                citations.append(Citation(**c))

            # Determine Policy Decision Status
            if eval_res["has_missing_info"]:
                status = DecisionStatus.INSUFFICIENT_INFORMATION
                conf = 0.5
            elif eval_res["is_eligible"]:
                # If there is a mutual exclusion conflict affecting this scheme
                if conflict_state.conflict_detected and pid in conflict_state.conflicting_policy_ids:
                    status = DecisionStatus.CONDITIONALLY_ELIGIBLE
                    conf = 0.85
                else:
                    status = DecisionStatus.ELIGIBLE
                    conf = 0.95
            else:
                status = DecisionStatus.INELIGIBLE
                conf = 0.95

            statuses.append(status)
            policy_results.append(
                PolicyEvaluationResult(
                    policy_id=pid,
                    scheme_name=scheme.get("name", pid),
                    decision=status,
                    confidence_score=conf,
                    satisfied_conditions=eval_res.get("satisfied_conditions", []),
                    failed_conditions=eval_res.get("failed_conditions", []),
                    missing_information=eval_res.get("missing_fields", []),
                    required_documents=scheme.get("required_documents", []),
                    benefits_summary=scheme.get("benefits", ""),
                    citations=citations,
                    official_application_url=scheme.get("official_portal")
                )
            )

        # Primary Aggregate Status
        if not coverage.decision_authorized and coverage.critical_missing > 0:
            primary = DecisionStatus.INSUFFICIENT_INFORMATION
        elif any(s == DecisionStatus.ELIGIBLE for s in statuses):
            primary = DecisionStatus.ELIGIBLE
        elif any(s == DecisionStatus.CONDITIONALLY_ELIGIBLE for s in statuses):
            primary = DecisionStatus.CONDITIONALLY_ELIGIBLE
        elif any(s == DecisionStatus.INSUFFICIENT_INFORMATION for s in statuses):
            primary = DecisionStatus.INSUFFICIENT_INFORMATION
        else:
            primary = DecisionStatus.INELIGIBLE

        return DecisionState(
            primary_status=primary,
            intent=intent,
            overall_confidence=round(sum(p.confidence_score for p in policy_results) / len(policy_results), 2) if policy_results else 0.8,
            results_by_policy=policy_results,
            coverage=coverage,
            conflict_state=conflict_state,
            missing_citizen_fields=coverage.unmet_critical_parameters
        )
