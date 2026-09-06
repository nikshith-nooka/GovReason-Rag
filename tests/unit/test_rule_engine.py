"""
Unit tests for Policy Rule Engine & Conflict Resolver.
"""

from packages.shared_types.models import PolicyRule, CitizenContext
from services.reasoning.rule_engine import PolicyRuleEngine
from services.reasoning.conflict_resolver import ConflictResolver


def test_rule_engine_income_evaluation():
    engine = PolicyRuleEngine()
    rule = PolicyRule(
        rule_id="R_INCOME_TEST",
        policy_id="TEST_SCHEME",
        parameter="annual_family_income",
        operator="<=",
        threshold_value=300000.0,
        clause_reference="Clause 1.1",
        is_mandatory=True
    )

    ctx_eligible = CitizenContext(annual_family_income=250000.0)
    passed, msg = engine.evaluate_rule(rule, ctx_eligible)
    assert passed is True

    ctx_ineligible = CitizenContext(annual_family_income=350000.0)
    passed, msg = engine.evaluate_rule(rule, ctx_ineligible)
    assert passed is False


def test_conflict_resolver_dual_scholarship():
    resolver = ConflictResolver([])
    ctx = CitizenContext(state="Telangana", existing_schemes_enrolled=["TS_EPASS_POSTMETRIC"])
    conflict = resolver.detect_and_resolve(["TS_EPASS_POSTMETRIC", "NSP_CSSS"], ctx)

    assert conflict.conflict_detected is True
    assert conflict.resolution_strategy == "STATUTORY_MUTUAL_EXCLUSION"
    assert "dual scholarship" in conflict.explanation.lower()
