"""
Hybrid Retrieval Engine combining Dense Vector Embeddings, Sparse BM25, and Reciprocal Rank Fusion (RRF).
"""

from typing import List, Dict, Any
from packages.config.llm_provider import BaseEmbeddingProvider, get_embedding_provider
from services.retrieval.bm25 import BM25Retriever


class HybridRetriever:
    def __init__(self, corpus: List[Dict[str, Any]] = None, embedding_provider: BaseEmbeddingProvider = None):
        self.corpus = corpus or []
        self.embedding_provider = embedding_provider or get_embedding_provider()
        self.bm25 = BM25Retriever(self.corpus)
        self.doc_embeddings: List[List[float]] = []
        self._build_vector_index()

    def _build_vector_index(self):
        if not self.corpus:
            return
        texts = [d.get("text", "") + " " + d.get("title", "") for d in self.corpus]
        self.doc_embeddings = self.embedding_provider.embed_documents(texts)

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        import math
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1)) or 1.0
        norm2 = math.sqrt(sum(b * b for b in v2)) or 1.0
        return dot / (norm1 * norm2)

    def retrieve_dense(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        q_vec = self.embedding_provider.embed_query(query)
        scored = []
        for idx, doc in enumerate(self.corpus):
            doc_vec = self.doc_embeddings[idx] if idx < len(self.doc_embeddings) else q_vec
            sim = self._cosine_similarity(q_vec, doc_vec)
            scored.append((doc, sim))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [{"doc": d, "score": s, "method": "dense"} for d, s in scored[:top_k]]

    def retrieve_sparse(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        bm25_res = self.bm25.retrieve(query, top_k=top_k)
        return [{"doc": d, "score": s, "method": "sparse_bm25"} for d, s in bm25_res]

    def retrieve_hybrid(self, query: str, top_k: int = 5, rrf_k: int = 60) -> List[Dict[str, Any]]:
        dense_results = self.retrieve_dense(query, top_k=top_k * 2)
        sparse_results = self.retrieve_sparse(query, top_k=top_k * 2)

        # Reciprocal Rank Fusion
        rrf_scores: Dict[str, float] = {}
        doc_map: Dict[str, Dict[str, Any]] = {}

        for rank, item in enumerate(dense_results):
            doc_id = item["doc"].get("id", str(rank))
            doc_map[doc_id] = item["doc"]
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (rrf_k + rank + 1))

        for rank, item in enumerate(sparse_results):
            doc_id = item["doc"].get("id", str(rank))
            doc_map[doc_id] = item["doc"]
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (rrf_k + rank + 1))

        sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        final_results = []
        for doc_id, score in sorted_docs[:top_k]:
            final_results.append({
                "doc": doc_map[doc_id],
                "rrf_score": round(score, 5),
                "strategy": "hybrid_dense_sparse_rrf"
            })
        return final_results
