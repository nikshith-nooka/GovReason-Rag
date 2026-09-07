"""
Policy Rule Engine for GovReasonRAG.
Evaluates structured boolean rules and AST predicates against citizen attributes.
"""

from typing import List, Dict, Any, Tuple
from packages.shared_types.models import (
    PolicyRule,
    CitizenContext,
    RuleConfidence
)


class PolicyRuleEngine:
    def evaluate_rule(self, rule: PolicyRule, context: CitizenContext) -> Tuple[bool, str]:
        param = rule.parameter
        op = rule.operator
        threshold = rule.threshold_value
        val = getattr(context, param, None)
        if val is None and hasattr(context, "__pydantic_extra__") and context.__pydantic_extra__:
            val = context.__pydantic_extra__.get(param)
        if val is None and hasattr(context, "model_extra") and context.model_extra:
            val = context.model_extra.get(param)

        if val is None:
            return False, f"Missing parameter '{param}' required for rule {rule.rule_id} ({rule.clause_reference})"

        # Handle Special Exception Overrides
        if param == "annual_family_income" and (getattr(context, "age", 0) or 0) >= 70 and ("PM_JAY" in rule.policy_id or "AB-PMJAY" in rule.policy_id):
            return True, "Age >= 70 qualifies for universal Ayushman cover (Income criterion waived)"

        # EWS specific income ceiling (₹3 Lakhs) for PMAY
        if param == "annual_family_income" and getattr(context, "social_category", "") == "EWS" and "PMAY" in rule.policy_id:
            ews_cap = 300000.0
            satisfied = float(val) <= ews_cap
            msg = f"annual_family_income (₹{val:,.0f}) <= EWS ceiling (₹{ews_cap:,.0f})" if satisfied else f"annual_family_income (₹{val:,.0f}) exceeds EWS ceiling of ₹{ews_cap:,.0f} (Note: Qualifies under LIG bracket up to ₹6,00,000)"
            return satisfied, msg

        # Comparison Logic
        try:
            if op == "<=":
                satisfied = float(val) <= float(threshold)
                msg = f"{param} (₹{val:,.0f} if currency) <= threshold ₹{threshold:,.0f}" if isinstance(val, (int, float)) else f"{val} <= {threshold}"
                return satisfied, msg if satisfied else f"{param} ({val}) exceeds threshold ({threshold})"
            
            elif op == ">=":
                satisfied = float(val) >= float(threshold)
                return satisfied, f"{param} ({val}) >= threshold ({threshold})" if satisfied else f"{param} ({val}) is below minimum requirement ({threshold})"

            elif op == "==":
                satisfied = (str(val).lower() == str(threshold).lower())
                return satisfied, f"{param} matches '{threshold}'" if satisfied else f"{param} ('{val}') does not match required '{threshold}'"

            elif op == "!=":
                satisfied = (str(val).lower() != str(threshold).lower())
                return satisfied, f"{param} is not '{threshold}'" if satisfied else f"{param} must not be '{threshold}'"

            elif op == ">":
                satisfied = float(val) > float(threshold)
                return satisfied, f"{param} ({val}) > {threshold}" if satisfied else f"{param} ({val}) does not satisfy > {threshold}"

            elif op == "IN":
                if isinstance(threshold, list):
                    satisfied = any(str(val).lower() == str(t).lower() for t in threshold)
                    return satisfied, f"{param} '{val}' is recognized in {threshold}" if satisfied else f"{param} '{val}' not in approved list {threshold}"
                satisfied = str(val).lower() in str(threshold).lower()
                return satisfied, f"{param} found in {threshold}"

            elif op == "NOT_IN":
                if isinstance(threshold, list):
                    satisfied = not any(str(val).lower() == str(t).lower() for t in threshold)
                    return satisfied, f"{param} not in excluded list"
                return True, "Passed exclusion check"

        except Exception as e:
            return False, f"Error evaluating predicate for {param}: {str(e)}"

        return False, f"Unknown operator {op}"

    def evaluate_scheme_rules(self, policy_id: str, rules: List[PolicyRule], context: CitizenContext) -> Dict[str, Any]:
        satisfied_conditions = []
        failed_conditions = []
        missing_fields = []

        for r in rules:
            if getattr(context, r.parameter, None) is None:
                missing_fields.append(r.parameter)
                continue

            passed, explanation = self.evaluate_rule(r, context)
            if passed:
                satisfied_conditions.append(f"{r.clause_reference}: {explanation}")
            else:
                failed_conditions.append(f"{r.clause_reference}: {explanation}")

        return {
            "policy_id": policy_id,
            "is_eligible": len(failed_conditions) == 0 and len(missing_fields) == 0,
            "has_missing_info": len(missing_fields) > 0,
            "satisfied_conditions": satisfied_conditions,
            "failed_conditions": failed_conditions,
            "missing_fields": list(set(missing_fields))
        }
