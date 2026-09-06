#!/usr/bin/env python3
"""
Transparent Scenario-by-Scenario Evaluation:
Runs the pipeline on 20 distinct benchmark scenarios, printing:
- Scenario ID
- Query
- Expected Ground Truth
- Actual Pipeline Decision
- Match Result (True/False)
- Latency (ms)
"""

import json
import time
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
SCHEMES_FILE = ROOT_DIR / "data" / "processed" / "schemes.json"
BENCHMARK_SCENARIOS = ROOT_DIR / "data" / "evaluation" / "benchmark_scenarios.json"

sys.path.insert(0, str(ROOT_DIR))
from services.reasoning.pipeline import GovReasonRAGPipeline

def main():
    with open(BENCHMARK_SCENARIOS, "r") as f:
        scenarios = json.load(f).get("scenarios", [])[:20]

    pipeline = GovReasonRAGPipeline(str(SCHEMES_FILE))

    print(f"{'#':<3} | {'Scenario ID':<25} | {'Expected':<15} | {'Actual Decision':<15} | {'Result':<7} | {'Time (ms)'}")
    print("-" * 80)

    matches = 0
    total = len(scenarios)

    for i, sc in enumerate(scenarios, 1):
        sid = sc["scenario_id"]
        q = sc["query"]
        expected = sc.get("ground_truth_decision") or sc.get("expected_decision", "PARTIAL")

        t0 = time.perf_counter()
        res = pipeline.run(q)
        lat = (time.perf_counter() - t0) * 1000

        # Check top decision
        results = res.results if hasattr(res, "results") else res.get("results", [])
        if results:
            actual = results[0].decision if hasattr(results[0], "decision") else results[0].get("decision")
        else:
            actual = "INSUFFICIENT_INFORMATION"

        # Direct strict equality
        is_match = (actual == expected)
        if is_match:
            matches += 1

        print(f"{i:<3} | {sid[:25]:<25} | {expected:<15} | {str(actual):<15} | {'MATCH' if is_match else 'DIFF':<7} | {lat:6.1f} ms")

    print("-" * 80)
    print(f"Direct Strict Matches: {matches}/{total} ({matches/total*100:.1f}%)")

if __name__ == "__main__":
    main()
