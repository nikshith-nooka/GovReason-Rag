"""
In-Memory BM25 Sparse Keyword Retrieval Engine for Policy Chunks.
"""

import math
import re
from typing import List, Dict, Any, Tuple


class BM25Retriever:
    def __init__(self, corpus: List[Dict[str, Any]] = None, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus = corpus or []
        self.doc_lengths = []
        self.avg_doc_len = 0.0
        self.doc_freqs: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b\w+\b", text)]

    def _build_index(self):
        if not self.corpus:
            return
        total_docs = len(self.corpus)
        total_len = 0

        for doc in self.corpus:
            tokens = self._tokenize(doc.get("text", "") + " " + doc.get("title", ""))
            self.doc_lengths.append(len(tokens))
            total_len += len(tokens)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                self.doc_freqs[t] = self.doc_freqs.get(t, 0) + 1

        self.avg_doc_len = total_len / total_docs if total_docs > 0 else 1.0

        for term, freq in self.doc_freqs.items():
            self.idf[term] = math.log(1.0 + (total_docs - freq + 0.5) / (freq + 0.5))

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        query_tokens = self._tokenize(query)
        scores = []

        for idx, doc in enumerate(self.corpus):
            doc_tokens = self._tokenize(doc.get("text", "") + " " + doc.get("title", ""))
            doc_len = self.doc_lengths[idx] if idx < len(self.doc_lengths) else len(doc_tokens)
            score = 0.0

            for q_term in query_tokens:
                if q_term not in self.idf:
                    continue
                tf = doc_tokens.count(q_term)
                idf = self.idf[q_term]
                numerator = tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avg_doc_len))
                score += idf * (numerator / denominator)

            if score > 0:
                scores.append((doc, round(score, 4)))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]
