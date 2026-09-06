# Novelty Boundary: Existing Tech vs. Proposed Research

To maintain scientific integrity and academic rigor, this document clearly delineates existing baseline technologies from the proposed research contribution.

---

## 1. Existing Technologies (Implementation Foundations)

The following components are established technologies and are **NOT** claimed as novel research contributions:
- **Retrieval-Augmented Generation (RAG)**: Standard chunk retrieval and context stuffing.
- **Hybrid Retrieval**: BM25 sparse keyword scoring + Dense vector embedding similarity.
- **Knowledge Graphs & Neo4j**: Standard property graph databases and Cypher query languages.
- **Vector Databases**: Qdrant, Milvus, FAISS vector indexing.
- **Workflow Orchestration**: LangChain, LangGraph state machine frameworks.
- **Large Language Models (LLMs)**: Pre-trained foundation models (OpenAI, Gemini, Anthropic, Ollama).

---

## 2. Proposed Research Mechanism (GovReasonRAG Innovations)

The core research contributions of **GovReasonRAG** are:

1. **Evidence Contracts (EC)**: Formalization of proactive evidence obligation schemas constructed before retrieval to enforce complete statutory requirement coverage.
2. **Evidence Coverage Engine**: A mathematical gatekeeper verifying that 100% of critical policy criteria are retrieved and grounded before any decision state can be authorized.
3. **Bi-Temporal Policy Evolution & Conflict Engine**: Modeling transaction time (gazette publication) vs. valid time (effective dates) along with superseding DAG edges to prevent outdated circular retrieval.
4. **Deterministic Rule Layer**: Decoupling boolean constraint evaluation ($Age, Income, Land, Domicile$) from generative language models to guarantee zero boundary hallucinations.
5. **Transparent Dead-Link Recovery**: Algorithmic detection of broken government portal links and automated fallback to verified official gazette mirrors.
