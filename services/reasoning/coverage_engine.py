"""
Evidence Coverage Engine for GovReasonRAG.
Assesses whether collected evidence satisfies the Evidence Contract's obligations.
"""

from typing import List, Dict, Any
from packages.shared_types.models import (
    EvidenceContract,
    EvidenceCoverage,
    ObligationStatus
)


class EvidenceCoverageEngine:
    def calculate_coverage(self, contract: EvidenceContract) -> EvidenceCoverage:
        total = len(contract.obligations)
        if total == 0:
            return EvidenceCoverage(
                total_obligations=0,
                covered_obligations=0,
                missing_obligations=0,
                critical_total=0,
                critical_covered=0,
                critical_missing=0,
                coverage_percentage=100.0,
                critical_coverage_percentage=100.0,
                decision_authorized=True,
                recommendation="PROCEED_TO_REASONING"
            )

        covered = sum(1 for o in contract.obligations if o.status == ObligationStatus.SATISFIED)
        missing = total - covered

        critical_obligations = [o for o in contract.obligations if o.critical]
        critical_total = len(critical_obligations)
        critical_covered = sum(1 for o in critical_obligations if o.status == ObligationStatus.SATISFIED)
        critical_missing = critical_total - critical_covered

        coverage_pct = round((covered / total) * 100.0, 1)
        crit_coverage_pct = round((critical_covered / critical_total) * 100.0, 1) if critical_total > 0 else 100.0

        unmet_critical = [o.parameter_name for o in critical_obligations if o.status != ObligationStatus.SATISFIED]

        # Decision is authorized ONLY IF all critical obligations are satisfied
        decision_authorized = (critical_missing == 0)

        if decision_authorized:
            recommendation = "PROCEED_TO_REASONING"
        elif critical_missing > 0:
            recommendation = "REQUEST_MORE_CITIZEN_INFO"
        else:
            recommendation = "ABSTAIN"

        return EvidenceCoverage(
            total_obligations=total,
            covered_obligations=covered,
            missing_obligations=missing,
            critical_total=critical_total,
            critical_covered=critical_covered,
            critical_missing=critical_missing,
            coverage_percentage=coverage_pct,
            critical_coverage_percentage=crit_coverage_pct,
            decision_authorized=decision_authorized,
            unmet_critical_parameters=list(set(unmet_critical)),
            recommendation=recommendation
        )
