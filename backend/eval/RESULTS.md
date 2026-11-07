# Retrieval Evaluation Benchmark (`M5`)

Valutazione quantitativa del sottosistema di recupero (`QueryFusionRetriever`: **BM25 + Vector Store Index** con *Reciprocal Rank Fusion*) su **30 query reali in italiano** (`backend/eval/retrieval_cases.json`) distribuite su tutte le 7 categorie della knowledge base del **LIFE Design Festival 2026** (`88` nodi indicizzati da `backend/knowledge/*.md`).

---

## 1. Risultati Sintetici

| Modalità Retriever | Query (`N`) | `Hit@5` | `Hit@10` | `Hit@20` | `MRR` | Rete / API |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Hybrid (`BM25 + Vector RRF`)** *(Produzione / Default)* | **30** | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **0.950** | `text-embedding-3-small` (OpenRouter) |
| **Offline (`BM25-only`)** *(CI / `--offline`)* | **30** | **96.7%** (`29/30`) | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **0.921** | Zero chiamate di rete |

---

## 2. Analisi Comparativa (Perché l'Ibrido Supera il Solo BM25)

- **Copertura lessicale (`BM25-only`)**: il chunking entity-centric (`process_document_by_entities`) preserva l'intestazione e i metadati su ogni nodo, consentendo al solo retriever lessicale BM25 di raggiungere **`96.7%` Hit@5** (`29/30`), **`100.0%` Hit@10** (`30/30`) e **`MRR 0.921`** senza alcuna chiamata di rete.
- **Vantaggio semantico del retriever ibrido (`BM25 + Vector RRF`)**: sulla query `q29_logistics_lodging` (*"Quali sono i B&B e gli hotel convenzionati per dormire a Potenza?"*), il testo sorgente in `programma-logistica.md` utilizza i termini *"alloggiare"* e *"strutture convenzionate"* ma non le parole esatte *"hotel"* o *"dormire"*. Il solo BM25 posiziona il nodo al **rank 7** (fuori dalla Top-5), mentre la fusione ibrida `BM25 + Vector` (`Reciprocal Rank Fusion`) lo porta in **Top-5**, raggiungendo **`100.0%` Hit@5** (`30/30`) e incrementando l'**MRR da `0.921` a `0.950`**.

---

## 3. Distribuzione del Dataset (`retrieval_cases.json`)

| Categoria | Numero Query | ID Casi |
| :--- | :---: | :--- |
| `speaker` | 10 | `q01` – `q10` |
| `sponsor` | 6 | `q11` – `q16` |
| `program` | 4 | `q17` – `q20` |
| `workshop` | 3 | `q21` – `q23` |
| `activity` | 3 | `q24` – `q26` |
| `logistics` | 3 | `q27` – `q29` |
| `team` | 1 | `q30` |

---

## 4. Come Riprodurre il Benchmark

Dalla root del repository:

```bash
# Modalità Offline (solo BM25, zero rete / zero API key, < 2s)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py --offline

# Modalità Predefinita Ibrida (BM25 + Vector RRF, richiede OPENROUTER_API_KEY in backend/.env)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py
```
