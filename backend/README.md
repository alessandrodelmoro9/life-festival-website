# 🎨 LIFE Design Festival 2025 - AI Assistant

Benvenuti nel repository ufficiale del **LIFE AI Assistant**, il chatbot RAG (Retrieval-Augmented Generation) dedicato al **LIFE Design Festival 2025** (6-7 Giugno, Potenza).

Questo assistente digitale è stato progettato per fornire informazioni in tempo reale su speaker, workshop, sponsor e logistica del festival, arricchendo l'esperienza utente con una galleria multimediale interattiva.

## 🚀 Caratteristiche principali
- **RAG Engine**: Basato su `gemma-3-27b-it` per risposte precise e contestualizzate.
- **Multimedialità**: Iniezione automatica di loghi sponsor e foto degli speaker durante la conversazione.
- **UX Ottimizzata**: Interfaccia Streamlit Premium con formattazione avanzata per orari e liste.
- **Zero Allucinazioni**: Regole ferree per attenersi esclusivamente ai dati ufficiali del festival.

## 🛠️ Stack Tecnico
- **Frontend**: [Streamlit](https://streamlit.io/)
- **LLM**: Google Generative AI (`gemma-3-27b-it`)
- **Embedding**: `gemini-embedding-001`
- **Vector Database**: [FAISS](https://github.com/facebookresearch/faiss)
- **Framework**: [LangChain](https://www.langchain.com/)

## 📦 Installazione locale
Se desideri eseguire il progetto sul tuo computer:

1. Clona il repository:
   ```bash
   git clone git@github.com:alessandrodelmoro9/life-chatbot-demo.git
   cd life-chatbot-demo
   ```

2. Installa le dipendenze (si consiglia l'uso di un ambiente virtuale):
   ```bash
   pip install -r requirements.txt
   ```

3. Configura le API Key:
   Crea una cartella `.streamlit/` e un file `secrets.toml` all'interno, inserendo la tua chiave Google:
   ```toml
   GOOGLE_API_KEY = "TUA_API_KEY"
   ```

4. Avvia l'app:
   ```bash
   streamlit run ui/app.py
   ```

## ☁️ Deployment su Streamlit Cloud
L'app è configurata per il deploy immediato su Streamlit Cloud. Ricordarsi di inserire la `GOOGLE_API_KEY` nei **Secrets** della dashboard di Streamlit durante la fase di setup.

---
*Progetto sviluppato per il LIFE Design Festival 2025.*
