"""
Unit tests for expanded GovReasonRAG features:
1. Bi-temporal policy version validator
2. Expanded statutory conflict rules
3. Dead link recovery & domain verification
4. 46 Schemes catalog & Knowledge Graph connectivity
"""

import os
import json
from packages.shared_types.models import CitizenContext
from services.reasoning.version_validator import PolicyVersionValidator
from services.reasoning.conflict_resolver import ConflictResolver
from services.reasoning.dead_link_recovery import DeadLinkRecoveryEngine
from services.policy_graph.graph_engine import PolicyGraphEngine

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCHEMES_FILE = os.path.join(BASE_DIR, "data", "processed", "schemes.json")

with open(SCHEMES_FILE) as f:
    CATALOG = json.load(f)["schemes"]


def test_catalog_16_schemes():
    assert len(CATALOG) >= 46
    scheme_ids = [s["id"] for s in CATALOG]
    assert "PM_VISHWAKARMA" in scheme_ids
    assert "SUKANYA_SAMRIDDHI" in scheme_ids
    assert "TS_GRUHA_JYOTHI" in scheme_ids
    assert "TS_MAHALAKSHMI" in scheme_ids
    assert "PM_SURYA_GHAR" in scheme_ids


def test_bitemporal_version_validator():
    validator = PolicyVersionValidator(CATALOG)
    
    # Check historical date for PMAY (2020 should map to v1.0_2015)
    res_past = validator.validate_temporal_validity("PMAY_U", "2020-01-01")
    assert res_past["valid"] is True
    assert res_past["version_tag"] == "v1.0_2015"

    # Check recent date for PMAY (2025 should map to v2.0_2024)
    res_now = validator.validate_temporal_validity("PMAY_U", "2025-01-01")
    assert res_now["valid"] is True
    assert res_now["version_tag"] == "v2.0_2024"


def test_conflict_resolver_solar_vs_free_power():
    resolver = ConflictResolver(CATALOG)
    ctx = CitizenContext(state="Telangana", pucca_house_owned=True, monthly_electricity_units=150.0)
    conflict = resolver.detect_and_resolve(["TS_GRUHA_JYOTHI", "PM_SURYA_GHAR"], ctx)

    assert conflict.conflict_detected is True
    assert "POWER_SUBSIDY_RECONCILIATION" in conflict.conflicting_clauses[0]["policy_id"] or conflict.resolution_strategy == "REGULATORY_TARIFF_HARMONIZATION"


def test_dead_link_recovery():
    recovery = DeadLinkRecoveryEngine()
    # Test known broken link recovery
    broken_url = "https://pmay-urban.gov.in/guidelines/2015"
    res = recovery.verify_and_recover_url(broken_url)
    assert res["is_active"] is False
    assert res["recovery_action_taken"] is True
    assert "pmay-u-2.0" in res["recovered_url"]
    assert res["domain_verified"] is True


def test_policy_knowledge_graph_connectivity():
    graph = PolicyGraphEngine(CATALOG)
    assert len(graph.nodes) >= 60
    assert len(graph.edges) >= 30
    subgraph = graph.query_subgraph("PM_KISAN")
    assert len(subgraph["nodes"]) > 0


def test_deterministic_llm_verbalizer_and_pipeline_trace():
    from packages.config.llm_provider import get_llm_provider, DeterministicPolicyLLM
    from services.reasoning.pipeline import GovReasonRAGPipeline

    llm = get_llm_provider("deterministic")
    assert isinstance(llm, DeterministicPolicyLLM)
    
    # Test generation on eligible context
    res_eligible = llm.generate("Query: Am I eligible? | Verdict: ELIGIBLE")
    assert "Official Eligibility Confirmation" in res_eligible

    # Test generation on disqualified context
    res_ineligible = llm.generate("Query: Am I eligible? | Verdict: INELIGIBLE")
    assert "Statutory Finding" in res_ineligible

    # Test full pipeline end-to-end trace with verbalization attached
    pipeline = GovReasonRAGPipeline()
    response = pipeline.run("My family annual income is Rs 2,50,000 in Hyderabad. Can I get PMAY-U 2.0?")
    assert response.research_trace["llm_verbalization"] is not None
    assert len(response.research_trace["llm_verbalization"].strip()) > 10
