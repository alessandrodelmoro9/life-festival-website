# Retrieval Evaluation Benchmark (`M5`)

Valutazione quantitativa del sottosistema di recupero (`QueryFusionRetriever`: **BM25 + Vector Store Index** con *Reciprocal Rank Fusion*) su **40 query in italiano** (`backend/eval/retrieval_cases.json`), suddivise in:
- **30 query con nome/riferimento diretto (`named: true`, `q01–q30`)**;
- **10 query parafrasate senza il nome dell'entità (`named: false`, `q31–q40`)**, per misurare il recupero semantico (es. *"Quale talk racconta come i progetti fatti per gioco possono diventare lavoro?"*, *"Quale talk parla di superare le regole dei manuali di brand?"*).

Ogni query ha almeno un nodo atteso il cui testo contiene davvero l'informazione richiesta.

---

## 1. Risultati per Modalità e Sottoinsieme

| Modalità Retriever | Sottoinsieme | Query (`N`) | `Hit@5` | `Hit@10` | `Hit@20` | `MRR` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Hybrid (`BM25 + Vector RRF`)** *(Default)* | **Totale** | **40** | **100.0%** (`40/40`) | **100.0%** (`40/40`) | **100.0%** (`40/40`) | **0.907** |
| **Hybrid (`BM25 + Vector RRF`)** | Con nome | 30 | 100.0% (`30/30`) | 100.0% (`30/30`) | 100.0% (`30/30`) | 0.950 |
| **Hybrid (`BM25 + Vector RRF`)** | Senza nome | 10 | 100.0% (`10/10`) | 100.0% (`10/10`) | 100.0% (`10/10`) | 0.778 |
| **Offline (`BM25-only`)** *(`--offline`)* | **Totale** | **40** | **92.5%** (`37/40`) | **97.5%** (`39/40`) | **100.0%** (`40/40`) | **0.846** |
| **Offline (`BM25-only`)** | Con nome | 30 | 96.7% (`29/30`) | 100.0% (`30/30`) | 100.0% (`30/30`) | 0.921 |
| **Offline (`BM25-only`)** | Senza nome | 10 | 80.0% (`8/10`) | 90.0% (`9/10`) | 100.0% (`10/10`) | 0.619 |

Con l'ibrido ogni query trova il nodo atteso nei primi 5; la differenza tra i sottoinsiemi si vede nell'`MRR` (posizione media del primo nodo corretto): `0.950` con nome, `0.778` senza nome.

---

## 2. Dove il solo BM25 non basta (query fuori dalla Top-5 in `--offline`)

| Query | Rank BM25 | Causa (verificabile nel Markdown) |
| :--- | :---: | :--- |
| `q29_logistics_lodging` — *"Quali sono i B&B e gli hotel convenzionati per dormire a Potenza?"* | 7 | Le parole *"hotel"* e *"dormire"* non compaiono in `programma-logistica.md`; la scheda usa *"dove alloggiare"* e *"strutture convenzionate"* (`programma-logistica.md:195`). |
| `q31_unnamed_side_projects` — *"Quale talk racconta come i progetti fatti per gioco possono diventare lavoro?"* | 9 | Il talk è descritto in inglese: *"Playground to Portfolio"* (`speaker-talk.md:323`) e *"I side projects…"* (`speaker-talk.md:330`). |
| `q33_unnamed_food` — *"Dove si mangia e cosa c'è da bere durante l'evento?"* | 20 | La scheda usa l'etichetta inglese *"Food & Drink"* (`programma-logistica.md:188`); *"mangia"* e *"bere"* non compaiono in nessun file. |

In tutti e tre i casi manca la corrispondenza lessicale e il retriever vettoriale la compensa: con la fusione ibrida le tre query rientrano nella Top-5.

---

## 3. Come Riprodurre il Benchmark

Dalla root del repository:

```bash
# Modalità Offline (solo BM25, zero rete / zero API key, < 2s)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py --offline

# Modalità Predefinita Ibrida (BM25 + Vector RRF, richiede OPENROUTER_API_KEY in backend/.env)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py
```
