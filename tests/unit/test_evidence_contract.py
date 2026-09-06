"""
Unit tests for Evidence Contract Builder & Coverage Engine.
"""

from packages.shared_types.models import CitizenContext, IntentType, ObligationStatus
from services.reasoning.contract_builder import EvidenceContractBuilder
from services.reasoning.coverage_engine import EvidenceCoverageEngine


def test_evidence_contract_construction():
    builder = EvidenceContractBuilder([])
    ctx = CitizenContext(age=21, annual_family_income=250000.0, state="Telangana")
    contract = builder.build_contract(
        query="Am I eligible for PMAY?",
        intent=IntentType.ELIGIBILITY_CHECK,
        target_policy_ids=["PMAY_U"],
        citizen_context=ctx
    )

    assert contract.contract_id.startswith("EC_")
    assert len(contract.obligations) > 0
    income_obl = next((o for o in contract.obligations if o.parameter_name == "annual_family_income"), None)
    assert income_obl is not None
    assert income_obl.status == ObligationStatus.SATISFIED
    assert income_obl.critical is True


def test_evidence_coverage_missing_critical_abstention():
    builder = EvidenceContractBuilder([])
    # Missing income
    ctx = CitizenContext(age=21, state="Telangana", annual_family_income=None)
    contract = builder.build_contract(
        query="Check eligibility",
        intent=IntentType.ELIGIBILITY_CHECK,
        target_policy_ids=["PMAY_U"],
        citizen_context=ctx
    )

    coverage_engine = EvidenceCoverageEngine()
    coverage = coverage_engine.calculate_coverage(contract)

    assert coverage.decision_authorized is False
    assert coverage.critical_missing > 0
    assert "annual_family_income" in coverage.unmet_critical_parameters
    assert coverage.recommendation == "REQUEST_MORE_CITIZEN_INFO"
