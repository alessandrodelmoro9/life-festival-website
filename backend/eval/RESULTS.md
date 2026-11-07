# Retrieval Evaluation Benchmark (`M5`)

Valutazione quantitativa del sottosistema di recupero (`QueryFusionRetriever`: **BM25 + Vector Store Index** con *Reciprocal Rank Fusion*) su **40 query reali in italiano** (`backend/eval/retrieval_cases.json`), suddivise in:
- **30 query con nome/riferimento diretto (`named: true`, `q01–q30`)**;
- **10 query parafrasate senza il nome dell'entità (`named: false`, `q31–q40`)**, per misurare il recupero semantico puro (es. *"Chi tiene un intervento sulla realtà aumentata?"*, *"Quale talk parla di superare le regole dei manuali di brand?"*).

---

## 1. Risultati per Modalità e Sottoinsieme

| Modalità Retriever | Sottoinsieme | Query (`N`) | `Hit@5` | `Hit@10` | `Hit@20` | `MRR` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Hybrid (`BM25 + Vector RRF`)** *(Default)* | **Totale (`ALL`)** | **40** | **97.5%** (`39/40`) | **97.5%** (`39/40`) | **97.5%** (`39/40`) | **0.901** |
| **Hybrid (`BM25 + Vector RRF`)** | **Con nome (`q01–q30`)** | **30** | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **0.950** |
| **Hybrid (`BM25 + Vector RRF`)** | **Senza nome (`q31–q40`)** | **10** | **90.0%** (`9/10`) | **90.0%** (`9/10`) | **90.0%** (`9/10`) | **0.753** |
| **Offline (`BM25-only`)** *(`--offline`)* | **Totale (`ALL`)** | **40** | **92.5%** (`37/40`) | **95.0%** (`38/40`) | **97.5%** (`39/40`) | **0.843** |
| **Offline (`BM25-only`)** | **Con nome (`q01–q30`)** | **30** | **96.7%** (`29/30`) | **100.0%** (`30/30`) | **100.0%** (`30/30`) | **0.921** |
| **Offline (`BM25-only`)** | **Senza nome (`q31–q40`)** | **10** | **80.0%** (`8/10`) | **80.0%** (`8/10`) | **90.0%** (`9/10`) | **0.608** |

---

## 2. Analisi Comparativa (`BM25` vs. `Hybrid RRF`)

- **Domande con nome (`N=30`)**: il chunking entity-centric consente al solo BM25 di raggiungere **`96.7%` Hit@5** (`MRR 0.921`), mentre l'ibrido arriva a **`100.0%` Hit@5** (`MRR 0.950`) recuperando in Top-5 anche la query sugli alloggi (`q29_logistics_lodging`) dove i termini *"hotel"* e *"dormire"* non compaiono letteralmente nel Markdown.
- **Domande parafrasate senza nome (`N=10`)**: in assenza del nome proprio dell'entità nella domanda, il solo BM25 scende a **`80.0%` Hit@5** e **`MRR 0.608`**, mentre la fusione ibrida `BM25 + Vector` (`text-embedding-3-small`) sale a **`90.0%` Hit@5** e **`MRR 0.753`** (**`+0.145` MRR**), dimostrando il contributo degli embedding densi sulle parafrasi concettuali.
- **Unico caso mancato a Top-20 (`q31_unnamed_ar`, sia in Hybrid sia in BM25)**:
  - **Domanda**: *"Chi tiene un intervento sulla realtà aumentata?"* — **ID atteso**: `["silvia-sguotti"]`.
  - **Nodi recuperati al suo posto (Top-5)**: `["workshop-enrica-daguanno", "dverso-studio", "brutto-studio", "italo-sannino", "simone-checchia"]` (ibrido) e `["simone-checchia", "brutto-studio", "dverso-studio", "italo-sannino", "workshop-enrica-daguanno"]` (BM25).
  - **Causa**: nella scheda di Silvia Sguotti in `backend/knowledge/speaker-talk.md` compare esclusivamente l'acronimo inglese *"AR"* (*"Spatial Computing e AR"*) e mai la forma estesa italiana *"realtà aumentata"*, mentre i termini comuni *"intervento"* e *"realtà"* spingono in alto le schede di altri speaker che usano la parola *"realtà"* (nel senso di *"realtà progettuale"*).

---

## 3. Come Riprodurre il Benchmark

Dalla root del repository:

```bash
# Modalità Offline (solo BM25, zero rete / zero API key, < 2s)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py --offline

# Modalità Predefinita Ibrida (BM25 + Vector RRF, richiede OPENROUTER_API_KEY in backend/.env)
backend/.venv/Scripts/python backend/eval/run_retrieval_eval.py
```
