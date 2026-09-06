"""
Scientific Metric Calculators for GovReasonRAG Benchmark & Baselines.
"""

from typing import List, Dict, Any


def calculate_decision_accuracy(predictions: List[str], ground_truths: List[str]) -> float:
    if not predictions or len(predictions) != len(ground_truths):
        return 0.0
    correct = sum(1 for p, g in zip(predictions, ground_truths) if p == g)
    return round((correct / len(predictions)) * 100.0, 2)


def calculate_critical_violation_rate(violations: int, total_decisions: int) -> float:
    if total_decisions == 0:
        return 0.0
    return round((violations / total_decisions) * 100.0, 2)


def calculate_version_accuracy(selected_versions: List[str], expected_versions: List[str]) -> float:
    if not selected_versions:
        return 0.0
    correct = sum(1 for s, e in zip(selected_versions, expected_versions) if s == e)
    return round((correct / len(selected_versions)) * 100.0, 2)


def calculate_evidence_coverage(covered: int, total: int) -> float:
    if total == 0:
        return 100.0
    return round((covered / total) * 100.0, 2)


def calculate_citation_faithfulness(verified_citations: int, total_citations: int) -> float:
    if total_citations == 0:
        return 100.0
    return round((verified_citations / total_citations) * 100.0, 2)
