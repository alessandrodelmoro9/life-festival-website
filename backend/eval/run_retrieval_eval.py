"""Retrieval evaluation benchmark for LIFE Design Festival RAG (M5).

Modes: Default (Hybrid BM25 + Vector RRF) or `--offline` (BM25 only, zero network calls).
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from llama_index.core import StorageContext, load_index_from_storage
from llama_index.core.retrievers import BaseRetriever, QueryFusionRetriever
from llama_index.retrievers.bm25 import BM25Retriever

CASES_FILE = Path(__file__).resolve().parent / "retrieval_cases.json"
STORAGE_DIR = BACKEND_DIR / "storage"
TOP_K = 20


def build_retriever(offline: bool) -> BaseRetriever:
    storage_context = StorageContext.from_defaults(persist_dir=str(STORAGE_DIR))
    nodes = list(storage_context.docstore.docs.values())
    bm25 = BM25Retriever.from_defaults(nodes=nodes, similarity_top_k=TOP_K)
    if offline:
        return bm25

    from llama_index.core.llms.mock import MockLLM
    from llama_index.embeddings.openai import OpenAIEmbedding
    from core.config import settings

    embed_model = OpenAIEmbedding(
        model=settings.EMBED_MODEL_NAME,
        api_key=settings.OPENROUTER_API_KEY,
        api_base=settings.OPENROUTER_BASE_URL,
    )
    index = load_index_from_storage(storage_context, embed_model=embed_model)
    return QueryFusionRetriever(
        retrievers=[index.as_retriever(similarity_top_k=TOP_K), bm25],
        llm=MockLLM(),
        similarity_top_k=TOP_K,
        num_queries=1,
        mode="reciprocal_rerank",
        use_async=False,
    )


def first_hit_rank(retriever: BaseRetriever, case: Dict[str, Any]) -> Optional[int]:
    ranked = list(dict.fromkeys(i.node.metadata.get("id") for i in retriever.retrieve(case["query"]) if i.node.metadata.get("id")))
    expected = set(case["expected_ids"])
    return next((idx for idx, cid in enumerate(ranked, 1) if cid in expected), None)


def summarize(label: str, ranks: List[Optional[int]]) -> str:
    n = len(ranks)
    hits = [sum(1 for r in ranks if r is not None and r <= k) for k in (5, 10, 20)]
    mrr = sum((1.0 / r) if r else 0.0 for r in ranks) / n
    return f"[{label}] N={n} | Hit@5: {hits[0]/n:.1%} ({hits[0]}/{n}) | Hit@10: {hits[1]/n:.1%} ({hits[1]}/{n}) | Hit@20: {hits[2]/n:.1%} ({hits[2]}/{n}) | MRR: {mrr:.3f}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Run RAG retrieval evaluation benchmark.")
    parser.add_argument("--offline", action="store_true", help="BM25-only offline mode.")
    args = parser.parse_args()

    cases = json.loads(CASES_FILE.read_text(encoding="utf-8"))
    retriever = build_retriever(offline=args.offline)
    mode = "OFFLINE (BM25)" if args.offline else "HYBRID (BM25+Vec)"
    ranks = [first_hit_rank(retriever, c) for c in cases]

    print(summarize(f"{mode} - ALL", ranks))
    print(summarize(f"{mode} - CON NOME", [r for c, r in zip(cases, ranks) if c.get("named", True)]))
    print(summarize(f"{mode} - SENZA NOME", [r for c, r in zip(cases, ranks) if not c.get("named", True)]))


if __name__ == "__main__":
    main()
