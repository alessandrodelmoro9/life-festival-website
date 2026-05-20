import os
import json
import re
from pathlib import Path
import tomllib
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# 1. Caricamento Segreti
SECRETS_PATH = Path(".streamlit/secrets.toml")
with open(SECRETS_PATH, "rb") as f:
    secrets = tomllib.load(f)
    os.environ["GOOGLE_API_KEY"] = secrets["GOOGLE_API_KEY"]

DATA_DIR = Path("data")
DB_DIR = Path("vector_db")

def extract_media_info(content):
    """Estrae immagini e link dai file markdown per la media_map."""
    media_info = {}
    # Esempio: ## Nome Speaker ... - **Immagine:** URL
    sections = re.split(r'##\s+', content)
    for section in sections[1:]:
        lines = section.split('\n')
        header = lines[0].strip()
        
        # Cerca URL Immagine
        img_match = re.search(r'https?://[^\s]+\.(?:jpg|png|jpeg|gif|png)', section, re.IGNORECASE)
        # Cerca Link (Eventbrite, Form, etc)
        link_match = re.search(r'https?://(?:www\.)?(?:eventbrite|docs\.google|instagram)[^\s)]+', section, re.IGNORECASE)
        
        if img_match or link_match:
            media_info[header.lower()] = {
                "label": header,
                "image": img_match.group(0) if img_match else None,
                "link": link_match.group(0) if link_match else None
            }
    return media_info

def process_markdown_files():
    all_documents = []
    global_media_map = {}
    
    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]
    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    # Aumentiamo a 3000 per tenere le giornate del programma unite
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)

    for md_file in DATA_DIR.glob("*.md"):
        print(f"📄 Processing: {md_file.name}")
        with open(md_file, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Estrazione Media
            global_media_map.update(extract_media_info(content))
            
            # Split per Header
            segments = markdown_splitter.split_text(content)
            
            # Ulteriore split se i blocchi sono troppo grandi
            final_chunks = text_splitter.split_documents(segments)
            
            # Arricchimento Metadati (estrazione anno e tags se presenti)
            for chunk in final_chunks:
                chunk.metadata["source"] = md_file.name
                if "2025" in content: chunk.metadata["year"] = 2025
                if "2026" in content: chunk.metadata["year"] = 2026
                
            all_documents.extend(final_chunks)
            
    return all_documents, global_media_map

def run_ingestion():
    print("🚀 Avvio Ingestione LIFE RAG...")
    
    docs, media_map = process_markdown_files()
    
    # Salvataggio Media Map
    with open("media_map.json", "w", encoding="utf-8") as f:
        json.dump(media_map, f, indent=4, ensure_ascii=False)
    print(f"✅ Mappati {len(media_map)} elementi media in media_map.json")

    # Creazione Vector Store
    print("🧠 Generazione Embeddings (Google text-embedding-004)...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", task_type="retrieval_document")
    
    vector_db = FAISS.from_documents(docs, embeddings)
    
    # Salvataggio DB
    if not DB_DIR.exists():
        DB_DIR.mkdir()
    
    vector_db.save_local(str(DB_DIR))
    print(f"💾 Database vettoriale salvato in {DB_DIR}/")
    print("✨ Ingestione completata con successo!")

if __name__ == "__main__":
    run_ingestion()
