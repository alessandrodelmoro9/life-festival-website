import os
import json
import re
from pathlib import Path
import tomllib
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def format_docs(docs):
    """Formatta i documenti recuperati in un'unica stringa di testo."""
    return "\n\n".join(doc.page_content for doc in docs)

def format_life_response(text):
    """Pulisce la risposta e ottimizza la leggibilità senza spaziatura eccessiva."""
    # 1. Rimuove link a immagini (jpg, png, svg, webp) che appaiono nel testo
    text = re.sub(r'https?://\S+\.(?:jpg|jpeg|png|svg|webp|gif)', '', text, flags=re.IGNORECASE)
    # Rimuove anche eventuali tag Markdown per immagini ![desc](url)
    text = re.sub(r'!\[.*?\]\(https?://\S+\)', '', text)
    
    # 2. Ottimizza la spaziatura delle liste
    lines = text.split('\n')
    formatted_lines = []
    in_list = False
    for line in lines:
        stripped = line.strip()
        # Riconosce punti elenco (- o *) o liste numerate (1. 2.)
        is_bullet = stripped.startswith('-') or stripped.startswith('*') or (len(stripped) > 2 and stripped[0].isdigit() and stripped[1] == '.')
        
        if is_bullet:
            # Aggiunge uno spazio solo prima dell'inizio della lista se non c'è già
            if not in_list and formatted_lines and formatted_lines[-1].strip() != "":
                formatted_lines.append("")
            formatted_lines.append(stripped)
            in_list = True
        else:
            formatted_lines.append(line)
            in_list = False
    
    text = '\n'.join(formatted_lines)
    
    # 3. Protezione ed evidenziazione orari (solo se non già in grassetto)
    text = re.sub(r'(?<!\*)(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})(?!\*)', r'**\1 - \2**', text)
    text = re.sub(r'(?<!\*)(\d{2}:\d{2})(?!\*)', r'**\1**', text)
    
    # 4. Pulizia spazi multipli generati
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

class LifeRagEngine:
    def __init__(self, vector_db, media_map):
        self.vector_db = vector_db
        self.media_map = media_map
        self.retriever = self.vector_db.as_retriever(search_kwargs={"k": 10})
        
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemma-3-27b-it",
            temperature=0.2, # Un po' più di stabilità ma con respiro
            streaming=True,
            max_retries=5
        )

        self.prompt = ChatPromptTemplate.from_template("""
        Sei l'assistente ufficiale del LIFE Design Festival 2025 (Potenza). 
        Il tuo compito è fornire informazioni accurate, complete e professionali basandoti ESCLUSIVAMENTE sul contesto fornito.

        ### REGOLE DI RISPOSTA ###
        1. **COMPLETEZZA**: Se ti chiedono di uno speaker o sponsor, includi il suo ruolo e una breve descrizione delle sue attività basandoti sui dati.
        2. **FORMATTAZIONE**: Usa i punti elenco per liste e orari. Usa il grassetto per evidenziare i nomi propri e gli orari.
        3. **ZERO ALLUCINAZIONI**: Se un dato (es. un orario o un prezzo) non è nel contesto, non inventarlo. Rispondi che l'informazione non è disponibile.
        4. **LINK**: Puoi includere link diretti (URL) nel testo se l'utente li chiede o se sono necessari per l'acquisto dei biglietti o per le call.
        5. **LINGUA**: Rispondi sempre in italiano in modo cordiale.
        6. **DISTINZIONE TEMPORALE**: Sii estremamente preciso tra Day 1 (6 giugno) e Day 2 (7 giugno). Non confondere gli speaker o le attività tra le due giornate.

        ### CONTESTO UFFICIALE ###
        {context}

        DOMANDA: {question}
        RISPOSTA:""")

        self.chain = (
            {"context": self.retriever | format_docs, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

    def get_media(self, full_answer: str, query: str = ""):
        """Identifica i media da mostrare basandosi sulla risposta e sulla query dell'utente."""
        injected_media = []
        ans_clean = full_answer.lower()
        query_clean = query.lower()
        
        # Uniamo query e risposta per una ricerca più ampia (fallback se il bot non ripete il nome)
        combined_text = f"{query_clean} {ans_clean}"
        
        for key, info in self.media_map.items():
            # Pulizia della chiave (es: rimuove parentesi)
            match_key = re.sub(r'\s*\(.*\)', '', key.lower()).strip()
            
            # 1. Logica Link migliorata: aggiunte parole chiave 'link', 'sito', 'web'
            if any(tw in match_key for tw in ['call', 'acquisto', 'social']):
                trigger_words = ['bigliett', 'ticket', 'acquist', 'iscrivi', 'iscrizion', 'form', 'call', 'partecipa', 'social', 'instagram', 'prezz', 'cost', 'link', 'sito', 'web']
                if any(tw in query_clean for tw in trigger_words):
                    if info not in injected_media:
                        injected_media.append(info)
                continue

            # 2. Logica Sponsor e Speaker con fix per "Potenza"
            label_clean = info.get('label', '').lower()
            
            # Matcher più robusto: cerchiamo parole intere nel testo combinato
            # Proviamo prima il match esatto del label o della chiave
            patterns = [
                rf'\b{re.escape(match_key)}\b',
                rf'\b{re.escape(label_clean)}\b'
            ]
            
            # Fix critico: Se la chiave è "potenza futura", non permettiamo il match solo su "potenza"
            # perché "potenza" è la città e compare ovunque.
            first_term = match_key.split()[0] if match_key.split() else ""
            if len(first_term) >= 4 and first_term != "potenza":
                patterns.append(rf'\b{re.escape(first_term)}\b')

            matched = False
            for pattern in patterns:
                # Controlliamo nel testo combinato (query + risposta)
                if len(pattern) > 2 and re.search(pattern, combined_text): 
                    matched = True
                    break
            
            if matched and info not in injected_media:
                injected_media.append(info)
                    
        return injected_media

    def ask_stream(self, query: str):
        return self.chain.stream(query)
