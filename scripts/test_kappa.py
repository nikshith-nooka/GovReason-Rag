import json

with open("data/evaluation/human_evaluation_study.json") as f:
    data = json.load(f)

scenarios = data["scenarios"]
# compute pairwise percent agreement on correctness:
pairs = [("annotator_1_policy_analyst", "annotator_2_legal_specialist"),
         ("annotator_1_policy_analyst", "annotator_3_civic_volunteer"),
         ("annotator_2_legal_specialist", "annotator_3_civic_volunteer")]

agreements = []
for a1, a2 in pairs:
    match = sum(1 for s in scenarios if s["annotator_scores"][a1]["agreed"] == s["annotator_scores"][a2]["agreed"])
    score_match = sum(1 for s in scenarios if abs(s["annotator_scores"][a1]["correctness"] - s["annotator_scores"][a2]["correctness"]) <= 1)
    exact_match = sum(1 for s in scenarios if s["annotator_scores"][a1]["correctness"] == s["annotator_scores"][a2]["correctness"])
    agreements.append({"verdict_match": match / len(scenarios), "close_score_match": score_match / len(scenarios), "exact_score_match": exact_match / len(scenarios)})

avg_verdict_agree = sum(p["verdict_match"] for p in agreements) / len(agreements)
avg_score_agree = sum(p["close_score_match"] for p in agreements) / len(agreements)
avg_exact_agree = sum(p["exact_score_match"] for p in agreements) / len(agreements)

# Gwet's AC1 statistic for high-prevalence categories
# Pa = observed agreement
Pa = avg_exact_agree
# Pe for AC1 = 2 * p * (1-p) for 2 categories or 1/K for multi
p_5 = 44 / 75
Pe = 2 * p_5 * (1 - p_5)
gwet_ac1 = (Pa - Pe) / (1 - Pe) if 1 - Pe > 0 else 1.0

print(f"Verdict Agreement: {avg_verdict_agree*100:.1f}%")
print(f"Score Agreement within 1 pt: {avg_score_agree*100:.1f}%")
print(f"Exact Score Match: {avg_exact_agree*100:.1f}%")
print(f"Gwet's AC1 (Paradox-resistant Kappa): {gwet_ac1:.3f}")
