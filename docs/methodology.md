# Methodology: Evidence-Contracted Policy Reasoning (ECPR)

## 1. Problem Formulation
In civic AI and public service delivery, standard Retrieval-Augmented Generation (RAG) fails due to:
1. **Unbounded Hallucinations on Eligibility Boundaries**: LLMs struggle with complex boolean constraints ($Age \ge 18 \land Income \le 250,000 \land Domicile = \text{"State"}$).
2. **Temporal Policy Drift**: Vector search retrieves obsolete, superseded circulars rather than the active gazette notification.
3. **Absence of Proof Completeness**: Generating answers when critical applicant parameters are missing leads to erroneous advice.

To resolve this, we formulate **Evidence-Contracted Policy Reasoning (ECPR)**.

---

## 2. Mathematical Definition of Evidence Contract
Let a citizen query be $Q$, extracted intent be $T$, and voluntary applicant context be $C = \{c_1, c_2, \dots, c_m\}$.

An **Evidence Contract** $\mathcal{EC}(Q, T, C)$ is defined as a tuple:
$$\mathcal{EC} = \langle \mathcal{P}, \mathcal{O}_{crit}, \mathcal{O}_{aux} \rangle$$
where:
- $\mathcal{P} = \{p_1, p_2, \dots, p_k\}$ is the set of identified candidate government schemes.
- $\mathcal{O}_{crit}$ is the set of **Critical Obligations** (e.g., income ceiling, nativity proof, active gazette version).
- $\mathcal{O}_{aux}$ is the set of **Auxiliary Obligations** (e.g., optional quota certificates, secondary benefits).

---

## 3. Evidence Coverage & Decision Authorization
Given retrieved evidence chunks $\mathcal{E}$, each obligation $o_i \in \mathcal{O}_{crit} \cup \mathcal{O}_{aux}$ is assigned a status:
$$s(o_i) \in \{\text{SATISFIED}, \text{FAILED}, \text{MISSING}, \text{CONTRADICTORY}\}$$

The **Critical Evidence Coverage** $\kappa_{crit}$ is given by:
$$\kappa_{crit} = \frac{|\{o \in \mathcal{O}_{crit} \mid s(o) = \text{SATISFIED}\}|}{|\mathcal{O}_{crit}|}$$

**Decision Authorization Invariant**:
$$\text{AuthorizeDecision}(\mathcal{EC}) = \begin{cases} 
\text{True}, & \text{if } \kappa_{crit} = 1.0 \\
\text{False (Abstain/Query)}, & \text{otherwise}
\end{cases}$$

---

## 4. ECPR Algorithm Pseudocode

```text
Algorithm: Evidence-Contracted Policy Reasoning (ECPR)
Input: Citizen Query Q, Citizen Context C, Policy Knowledge Base K
Output: Explainable Grounded Response R

1.  T <- DetectIntent(Q)
2.  C <- ExtractContext(Q, C)
3.  P <- HybridRetrieveCandidatePolicies(Q, K)
4.  EC <- ConstructEvidenceContract(Q, T, P, C)
5.  E_retrieved <- RetrieveHybridAndGraphEvidence(EC, K)
6.  E_valid <- ValidateActiveVersionsAndSources(E_retrieved, K)
7.  Coverage <- EvaluateEvidenceCoverage(EC, E_valid)
8.  IF NOT Coverage.decision_authorized THEN
9.      Return GenerateAbstentionOrClarification(Coverage.unmet_critical)
10. END IF
11. RuleResults <- EvaluateStructuredRules(P, C, E_valid)
12. Conflicts <- DetectAndResolveConflicts(P, C)
13. DecisionState <- AuthorizeDeterministicDecision(RuleResults, Conflicts)
14. Citations <- LinkAuthoritativeClauses(DecisionState, E_valid)
15. R <- SynthesizeExplainableResponse(DecisionState, Citations)
16. Return R
```
