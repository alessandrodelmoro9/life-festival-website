"""Retrieval evaluation benchmark for LIFE Design Festival RAG (M5).

Modes:
- Default (Hybrid): QueryFusionRetriever (BM25 + VectorStoreIndex from backend/storage/).
  Requires OPENROUTER_API_KEY in environment / backend/.env to embed the 30 test queries.
- `--offline` (BM25 only): Loads nodes directly from backend/storage/docstore.json with
  zero network calls and zero API keys required (suitable for offline CI).
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from llama_index.core import StorageContext, load_index_from_storage
from llama_index.core.retrievers import BaseRetriever, QueryFusionRetriever
from llama_index.retrievers.bm25 import BM25Retriever

EVAL_DIR = Path(__file__).resolve().parent
CASES_FILE = EVAL_DIR / "retrieval_cases.json"
RESULTS_FILE = EVAL_DIR / "RESULTS.md"
STORAGE_DIR = BACKEND_DIR / "storage"
TOP_K = 20


def build_retriever(offline: bool) -> BaseRetriever:
    storage_context = StorageContext.from_defaults(persist_dir=str(STORAGE_DIR))
    nodes = list(storage_context.docstore.docs.values())
    bm25_retriever = BM25Retriever.from_defaults(nodes=nodes, similarity_top_k=TOP_K)

    if offline:
        return bm25_retriever

    from llama_index.core.llms.mock import MockLLM
    from llama_index.embeddings.openai import OpenAIEmbedding
    from core.config import settings

    embed_model = OpenAIEmbedding(
        model=settings.EMBED_MODEL_NAME,
        api_key=settings.OPENROUTER_API_KEY,
        api_base=settings.OPENROUTER_BASE_URL,
    )
    index = load_index_from_storage(storage_context, embed_model=embed_model)
    vector_retriever = index.as_retriever(similarity_top_k=TOP_K)
    return QueryFusionRetriever(
        retrievers=[vector_retriever, bm25_retriever],
        llm=MockLLM(),
        similarity_top_k=TOP_K,
        num_queries=1,
        mode="reciprocal_rerank",
        use_async=False,
    )


def evaluate_cases(retriever: BaseRetriever, cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    details: List[Dict[str, Any]] = []
    hits_5 = 0
    hits_10 = 0
    hits_20 = 0
    mrr_sum = 0.0

    for case in cases:
        retrieved = retriever.retrieve(case["query"])
        ranked_ids: List[str] = []
        for item in retrieved:
            cid = item.node.metadata.get("id")
            if cid and cid not in ranked_ids:
                ranked_ids.append(cid)

        expected = set(case["expected_ids"])
        first_rank = None
        for idx, cid in enumerate(ranked_ids, start=1):
            if cid in expected:
                first_rank = idx
                break

        hit5 = first_rank is not None and first_rank <= 5
        hit10 = first_rank is not None and first_rank <= 10
        hit20 = first_rank is not None and first_rank <= 20
        rr = (1.0 / first_rank) if first_rank is not None else 0.0

        hits_5 += int(hit5)
        hits_10 += int(hit10)
        hits_20 += int(hit20)
        mrr_sum += rr

        details.append(
            {
                "id": case["id"],
                "category": case["category"],
                "query": case["query"],
                "expected_ids": case["expected_ids"],
                "first_rank": first_rank,
                "top5_ids": ranked_ids[:5],
                "rr": rr,
            }
        )

    total = len(cases)
    return {
        "total": total,
        "hit_at_5": hits_5 / total,
        "hit_at_10": hits_10 / total,
        "hit_at_20": hits_20 / total,
        "hits_5": hits_5,
        "hits_10": hits_10,
        "hits_20": hits_20,
        "mrr": mrr_sum / total,
        "details": details,
    }


def format_summary(mode_label: str, metrics: Dict[str, Any]) -> str:
    n = metrics["total"]
    return (
        f"[{mode_label}] Queries: {n} | "
        f"Hit@5: {metrics['hit_at_5']:.1%} ({metrics['hits_5']}/{n}) | "
        f"Hit@10: {metrics['hit_at_10']:.1%} ({metrics['hits_10']}/{n}) | "
        f"Hit@20: {metrics['hit_at_20']:.1%} ({metrics['hits_20']}/{n}) | "
        f"MRR: {metrics['mrr']:.3f}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Run RAG retrieval evaluation benchmark.")
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Run BM25-only retrieval offline (zero network / API calls).",
    )
    args = parser.parse_args()

    cases = json.loads(CASES_FILE.read_text(encoding="utf-8"))
    mode_label = "OFFLINE (BM25-only)" if args.offline else "HYBRID (BM25 + Vector RRF)"
    retriever = build_retriever(offline=args.offline)
    metrics = evaluate_cases(retriever, cases)
    print(format_summary(mode_label, metrics))

    misses = [d for d in metrics["details"] if d["first_rank"] is None or d["first_rank"] > 5]
    if misses:
        print("Queries outside Top-5:")
        for m in misses:
            print(f"  - {m['id']} (rank={m['first_rank']}): expected={m['expected_ids']} got_top5={m['top5_ids']}")


if __name__ == "__main__":
    main()
