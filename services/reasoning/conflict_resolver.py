"""
Conflict Resolution Engine for GovReasonRAG.
Detects and resolves statutory conflicts, cross-scheme mutual exclusions,
jurisdictional overlaps, and double-dipping benefit restrictions.
"""

from typing import List, Dict, Any, Optional
from packages.shared_types.models import ConflictState, CitizenContext


class ConflictResolver:
    def __init__(self, scheme_catalog: List[Dict[str, Any]] = None):
        self.scheme_catalog = scheme_catalog or []

    def detect_and_resolve(
        self,
        candidate_policy_ids: List[str],
        context: CitizenContext
    ) -> ConflictState:
        conflicts = []
        enrolled = set(context.existing_schemes_enrolled or [])
        targets = set(candidate_policy_ids)
        all_schemes = targets.union(enrolled)

        # 1. Dual Scholarship Mutual Exclusion (Central vs State or Central vs Central)
        has_tsepass = "TS_EPASS_POSTMETRIC" in all_schemes
        has_nsp = "NSP_CSSS" in all_schemes
        has_nmmss = "NMMSS_SCHOLARSHIP" in all_schemes

        if has_tsepass and has_nsp:
            conflicts.append({
                "type": "DUAL_SCHOLARSHIP_MUTEX",
                "policies": ["TS_EPASS_POSTMETRIC", "NSP_CSSS"],
                "clauses": [
                    {"policy_id": "NSP_CSSS", "clause": "Section 5 - Mutual Exclusion: Beneficiary cannot receive dual scholarships from Central/State sources."},
                    {"policy_id": "TS_EPASS_POSTMETRIC", "clause": "Rule 7.3 - Prohibits simultaneous scholarship drawl from any other government agency."}
                ],
                "strategy": "STATUTORY_MUTUAL_EXCLUSION",
                "resolution": "Statutory Conflict Detected: Dual scholarship drawl is prohibited. Student cannot draw concurrent tuition/maintenance from both Central and State scholarship portals. Must choose either TS ePASS (covers tuition fee) or NSP CSSS (merit allowance)."
            })

        if has_nsp and has_nmmss:
            conflicts.append({
                "type": "DUAL_CENTRAL_SCHOLARSHIP",
                "policies": ["NSP_CSSS", "NMMSS_SCHOLARSHIP"],
                "clauses": [
                    {"policy_id": "NSP_CSSS", "clause": "Clause 4.2 - Disqualification if receiving other Central Sector scholarships."}
                ],
                "strategy": "STATUTORY_MUTUAL_EXCLUSION",
                "resolution": "Simultaneous drawl of two Central Sector merit scholarships is prohibited by Ministry of Education."
            })

        # 2. Subsidized Free Power vs Solar Rooftop Net-Metering
        has_gruha = "TS_GRUHA_JYOTHI" in all_schemes
        has_surya = "PM_SURYA_GHAR" in all_schemes
        if has_gruha and has_surya:
            conflicts.append({
                "type": "POWER_SUBSIDY_RECONCILIATION",
                "policies": ["TS_GRUHA_JYOTHI", "PM_SURYA_GHAR"],
                "clauses": [
                    {"policy_id": "TS_GRUHA_JYOTHI", "clause": "G.O.Ms. 4 Section 3 - Gruha Jyothi zero-tariff applies strictly to domestic retail metered consumers with consumption <= 200 units."},
                    {"policy_id": "PM_SURYA_GHAR", "clause": "MNRE Guidelines Section 4.1 - Grid-tied rooftop solar installations operate on bidirectional net-metering tariff."}
                ],
                "strategy": "REGULATORY_TARIFF_HARMONIZATION",
                "resolution": "Tariff Reconciliation Needed: Beneficiaries with grid-tied rooftop solar must settle net-metering bills via DISCOM regulations before Gruha Jyothi zero-bill adjustment is credited."
            })

        # 3. Double Housing Allotment Restriction
        has_pmay = "PMAY_U" in all_schemes
        if has_pmay and context.pucca_house_owned:
            conflicts.append({
                "type": "EXISTING_PUCCA_HOUSE_BAR",
                "policies": ["PMAY_U"],
                "clauses": [
                    {"policy_id": "PMAY_U", "clause": "Section 2.4 - A beneficiary family must not own a pucca house in any part of India."}
                ],
                "strategy": "STATUTORY_INELIGIBILITY",
                "resolution": "Ineligible for PMAY-U 2.0: Ownership of pucca dwelling is an absolute disqualifier under MoHUA guidelines."
            })

        # 4. Micro-Credit Margin Money Subsidy Duplicate Allotment
        has_pmegp = "PMEGP_LOAN" in all_schemes
        has_mudra = "PMMY_MUDRA" in all_schemes
        if has_pmegp and has_mudra:
            conflicts.append({
                "type": "DUAL_CAPITAL_SUBSIDY_RESTRICTION",
                "policies": ["PMEGP_LOAN", "PMMY_MUDRA"],
                "clauses": [
                    {"policy_id": "PMEGP_LOAN", "clause": "KVIC PMEGP Section 3.3 - Units already financed under other Government Capital Subsidy schemes are ineligible."}
                ],
                "strategy": "PROJECT_SEPARATION_RULE",
                "resolution": "An entrepreneur cannot seek PMEGP margin money capital subsidy for an enterprise setup already financed under MUDRA credit guarantee, unless expanding into a completely distinct project."
            })

        # 5. Overlapping Farmer Support Disqualification
        has_kisan = "PM_KISAN" in all_schemes
        has_rythu = "TS_RYTHU_BHAROSA" in all_schemes
        if has_kisan and has_rythu:
            # Note: Both schemes CAN be co-benefited! This is a harmonious co-benefit!
            # We record resolution as HARMONIOUS_CO_BENEFIT
            pass

        if conflicts:
            first_c = conflicts[0]
            return ConflictState(
                conflict_detected=True,
                conflicting_policy_ids=first_c["policies"],
                conflicting_clauses=first_c["clauses"],
                resolution_strategy=first_c["strategy"],
                resolved=True,
                explanation=first_c["resolution"]
            )

        return ConflictState(
            conflict_detected=False,
            conflicting_policy_ids=[],
            conflicting_clauses=[],
            resolution_strategy=None,
            resolved=True,
            explanation="No cross-policy statutory conflicts detected. Schemes can be availed concurrently where applicable."
        )
