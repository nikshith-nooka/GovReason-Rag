"""
Evidence Contract Builder for GovReasonRAG.
Deconstructs citizen queries and identifies mandatory and auxiliary evidence obligations
directly aligned with statutory scheme rules and parameters.
"""

import uuid
from typing import List, Dict, Any, Optional
from packages.shared_types.models import (
    EvidenceContract,
    EvidenceObligation,
    ObligationStatus,
    IntentType,
    CitizenContext
)


class EvidenceContractBuilder:
    def __init__(self, scheme_catalog: Optional[List[Dict[str, Any]]] = None):
        self.scheme_catalog = scheme_catalog or []

    def build_contract(
        self,
        query: str,
        intent: IntentType,
        target_policy_ids: List[str],
        citizen_context: CitizenContext
    ) -> EvidenceContract:
        contract_id = f"EC_{uuid.uuid4().hex[:8]}"
        obligations: List[EvidenceObligation] = []

        for policy_id in target_policy_ids:
            policy_meta = next((s for s in self.scheme_catalog if s["id"] == policy_id), None)
            rules = policy_meta.get("rules", []) if policy_meta else []

            if rules:
                for r in rules:
                    param = r["parameter"]
                    val = getattr(citizen_context, param, None)
                    is_critical = r.get("is_mandatory", True)
                    
                    # Status is SATISFIED if citizen provided the parameter value
                    status = ObligationStatus.SATISFIED if val is not None else ObligationStatus.MISSING
                    
                    obligations.append(
                        EvidenceObligation(
                            obligation_id=f"{policy_id}_OBL_{param.upper()}",
                            parameter_name=param,
                            description=f"Statutory verification for {param} under {r.get('clause_reference', policy_id)}",
                            critical=is_critical,
                            required_operator=r.get("operator"),
                            target_value=r.get("threshold_value"),
                            status=status,
                            retrieved_value=val
                        )
                    )
            else:
                # Default income obligation if no explicit rules loaded
                obligations.append(
                    EvidenceObligation(
                        obligation_id=f"{policy_id}_OBL_INCOME",
                        parameter_name="annual_family_income",
                        description=f"Verify annual parental/family income ceiling for {policy_id}",
                        critical=True,
                        status=ObligationStatus.SATISFIED if citizen_context.annual_family_income is not None else ObligationStatus.MISSING,
                        retrieved_value=citizen_context.annual_family_income
                    )
                )

            # Domicile Obligation for state-specific policies
            if policy_meta and policy_meta.get("jurisdiction") not in ["All India", "All India (Urban)"]:
                if not any(o.parameter_name == "state" and o.obligation_id.startswith(policy_id) for o in obligations):
                    obligations.append(
                        EvidenceObligation(
                            obligation_id=f"{policy_id}_OBL_DOMICILE",
                            parameter_name="state",
                            description=f"Verify applicant residence in {policy_meta.get('jurisdiction')}",
                            critical=True,
                            status=ObligationStatus.SATISFIED if citizen_context.state else ObligationStatus.MISSING,
                            retrieved_value=citizen_context.state
                        )
                    )

            # Active Policy Version Validity Obligation (Critical Invariant)
            active_version = policy_meta.get("current_version", "active") if policy_meta else "active"
            obligations.append(
                EvidenceObligation(
                    obligation_id=f"{policy_id}_OBL_VERSION",
                    parameter_name="policy_version",
                    description=f"Verify retrieval of active gazette version ({active_version}) for {policy_id}",
                    critical=True,
                    status=ObligationStatus.SATISFIED,
                    retrieved_value=active_version
                )
            )

        return EvidenceContract(
            contract_id=contract_id,
            intent=intent,
            target_policy_ids=target_policy_ids,
            obligations=obligations,
            notes=f"Constructed evidence contract with {len(obligations)} obligations across {len(target_policy_ids)} target policies."
        )
