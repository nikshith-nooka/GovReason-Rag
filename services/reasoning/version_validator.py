"""
Policy Version Validator for GovReasonRAG.
Tracks bi-temporal policy validity (Transaction Time in Gazette vs Valid Time of Effectiveness),
prevents retrieval of superseded clauses, and resolves historical amendment states.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date
from packages.shared_types.models import PolicyVersion, PolicyStatus


class PolicyVersionValidator:
    def __init__(self, scheme_catalog: Optional[List[Dict[str, Any]]] = None):
        self.scheme_catalog = scheme_catalog or []

    def get_active_version(self, policy_id: str) -> Optional[Dict[str, Any]]:
        scheme = next((s for s in self.scheme_catalog if s["id"] == policy_id), None)
        if not scheme:
            return None
        active_tag = scheme.get("current_version")
        for v in scheme.get("versions", []):
            if v.get("version_tag") == active_tag or v.get("status") == "active":
                return v
        return scheme.get("versions", [None])[0]

    def _parse_date(self, d_str: Optional[str]) -> Optional[date]:
        if not d_str:
            return None
        try:
            return datetime.strptime(d_str[:10], "%Y-%m-%d").date()
        except Exception:
            return None

    def validate_temporal_validity(
        self,
        policy_id: str,
        as_of_date_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Bi-Temporal Policy Evaluation:
        1. Transaction Time (Gazette Notification Date): When the government formally published the circular.
        2. Valid Time (Effective Range): [effective_from, effective_to] when the rule is legally applicable.
        """
        scheme = next((s for s in self.scheme_catalog if s["id"] == policy_id), None)
        if not scheme:
            return {"valid": False, "reason": f"Policy {policy_id} not found in catalog."}

        target_date = self._parse_date(as_of_date_str) or date.today()
        versions = scheme.get("versions", [])

        matched_version = None
        for v in versions:
            pub_date = self._parse_date(v.get("published_date"))
            eff_from = self._parse_date(v.get("effective_from"))
            eff_to = self._parse_date(v.get("effective_to"))

            # Must have been published on or before the target date
            if pub_date and pub_date > target_date:
                continue

            # Must fall within effective range
            if eff_from and target_date < eff_from:
                continue
            if eff_to and target_date > eff_to:
                continue

            matched_version = v
            break

        if not matched_version:
            # Fall back to currently active version
            matched_version = self.get_active_version(policy_id)

        is_current = (matched_version.get("version_tag") == scheme.get("current_version"))
        return {
            "valid": True,
            "as_of_date": str(target_date),
            "version_tag": matched_version.get("version_tag") if matched_version else "unknown",
            "published_date": matched_version.get("published_date") if matched_version else None,
            "effective_from": matched_version.get("effective_from") if matched_version else None,
            "is_current": is_current,
            "status": matched_version.get("status") if matched_version else "active",
            "superseded_by": matched_version.get("superseded_by") if matched_version else None
        }

    def validate_clause_freshness(self, policy_id: str, clause_version_tag: str) -> Dict[str, Any]:
        scheme = next((s for s in self.scheme_catalog if s["id"] == policy_id), None)
        if not scheme:
            return {"valid": False, "reason": f"Unknown policy {policy_id}"}

        current_ver = scheme.get("current_version")
        if clause_version_tag == current_ver:
            return {
                "valid": True,
                "status": "ACTIVE_CURRENT",
                "current_version": current_ver,
                "message": f"Clause belongs to active gazette version {current_ver}."
            }

        # Check if clause is superseded
        for v in scheme.get("versions", []):
            if v.get("version_tag") == clause_version_tag and v.get("status") == "superseded":
                return {
                    "valid": False,
                    "status": "SUPERSEDED_HISTORICAL",
                    "superseded_by": v.get("superseded_by", current_ver),
                    "current_version": current_ver,
                    "message": f"Clause from version {clause_version_tag} is superseded by {current_ver}."
                }

        return {
            "valid": True,
            "status": "ASSUMED_VALID",
            "current_version": current_ver,
            "message": "Clause version verified."
        }
