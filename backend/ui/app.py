import streamlit as st
import sys
import re
import json
import os
from pathlib import Path
import tomllib
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

# Setup path
sys.path.append(str(Path(__file__).parent.parent))
from core.engine import LifeRagEngine, format_life_response

# --- CONFIGURAZIONE ---
LOGO_PATH = "data/images/life logo.png"
st.set_page_config(page_title="LIFE AI Assistant", page_icon=LOGO_PATH, layout="wide", initial_sidebar_state="collapsed")

# CSS Migliorato
st.markdown("""<style>
    .stApp { background: #ffffff; padding-top: 20px; }
    [data-testid="stSidebar"] { display: none; }
    header { display: none !important; }
    
    /* Forza il tema chiaro e il contrasto della chat */
    [data-testid="stChatMessage"] { 
        background-color: #f7f7f7 !important; 
        border-radius: 12px !important; 
        border: 1px solid #eeeeee !important;
        margin-bottom: 15px !important;
        max-width: 850px !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }
    
    /* Testo scuro garantito in ogni condizione */
    [data-testid="stChatMessage"] p, [data-testid="stChatMessage"] span, [data-testid="stChatMessage"] li { 
        color: #31333f !important; 
        font-size: 0.95rem !important;
    }

    .stChatInputContainer { border-top: 1px solid #f0f0f0 !important; padding-top: 10px !important; }
    
    /* Fix per immagini in colonne */
    [data-testid="column"] img { border-radius: 8px; border: 1px solid #eee; }
    
    /* Nasconde elementi parassiti */
    .element-container:empty { display: none; }
</style>""", unsafe_allow_html=True)
# 1. Caricamento Heavy (Cache)
@st.cache_resource
def get_engine():
    # Caricamento credenziali
    secrets_path = Path(".streamlit/secrets.toml")
    if secrets_path.exists():
        with open(secrets_path, "rb") as f:
            secrets = tomllib.load(f)
            os.environ["GOOGLE_API_KEY"] = secrets["GOOGLE_API_KEY"]

    # Inizializzazione RAG
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        task_type="retrieval_query"
    )
    vector_db = FAISS.load_local("vector_db", embeddings, allow_dangerous_deserialization=True)

    if not Path("media_map.json").exists():
        mmap = {}
    else:
        with open("media_map.json", "r", encoding="utf-8") as f:
            mmap = json.load(f)

    # Creiamo l'engine usando la classe appena importata
    return LifeRagEngine(vector_db, mmap)

# Inizializzazione
engine = get_engine()

def render_media_section(media_list):
    if not media_list:
        return
    # Spazio extra prima dei media
    st.markdown("<br>", unsafe_allow_html=True)
    
    with st.container():
        # Filtriamo duplicati e media validi
        seen = set()
        valid_media = []
        for m in media_list:
            m_id = m.get("image") or m.get("link")
            if m_id and m_id not in seen:
                valid_media.append(m)
                seen.add(m_id)
        
        if not valid_media: return
        
        # Se sono tanti media (es. cronoprogramma), usiamo colonne più strette (5 per riga)
        cols_per_row = 5 if len(valid_media) > 4 else 3
        
        for i in range(0, len(valid_media), cols_per_row):
            row_media = valid_media[i : i + cols_per_row]
            cols = st.columns(cols_per_row)
            for idx, m in enumerate(row_media):
                with cols[idx]:
                    img_url = m.get("image")
                    label = m.get("label", "")
                    link = m.get("link")
                    
                    if img_url:
                        st.image(img_url, use_container_width=True)
                    
                    if link:
                        st.markdown(f"<div style='text-align: center; font-size: 0.65rem; margin-top: 2px;'><a href='{link}' target='_blank' style='color: #888; text-decoration: none;'>🔗 {label}</a></div>", unsafe_allow_html=True)
                    elif label:
                        st.markdown(f"<div style='text-align: center; font-size: 0.65rem; color: #999; margin-top: 2px;'>{label}</div>", unsafe_allow_html=True)

# --- NAVBAR ---
nav1, nav2, nav3 = st.columns([1, 4, 1])
with nav1:
    logo_path = Path("data/images/life logo.png")
    if logo_path.exists(): st.image(str(logo_path), width=90)
with nav2:
    st.markdown("<div style='text-align: center; color: #888; font-size: 11px; margin-top: 15px; letter-spacing: 2px;'>6-7 GIUGNO • POTENZA • TERMINAL GALLITELLO</div>", unsafe_allow_html=True)
with nav3:
    if st.button("RESET", key="reset_nav"):
        st.session_state.messages = []
        st.rerun()

st.divider()

if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Ciao! Come posso aiutarti oggi per il LIFE Festival?", "media": []}]

# Container per la chat
chat_container = st.container()

with chat_container:
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            if "media" in msg and msg["media"]:
                render_media_section(msg["media"])

# Chat Input
user_input = st.chat_input("Scrivi qui...")
if user_input:
    with chat_container:
        with st.chat_message("user"): 
            st.markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    with chat_container:
        with st.chat_message("assistant"):
            placeholder = st.empty()
            full_resp = ""
            
            with st.spinner("LIFE Assistant sta scrivendo..."):
                try:
                    for chunk in engine.ask_stream(user_input):
                        full_resp += chunk
                        display_text = format_life_response(full_resp)
                        placeholder.markdown(display_text + "▌")
                except Exception as e:
                    st.warning("⚠️ Errore di connessione. Riprova tra un istante.")
                    full_resp = "C'è molta richiesta in questo momento. Riprova tra un istante!"
            
            final_text = format_life_response(full_resp)
            placeholder.markdown(final_text)
            
            # Passiamo sia la risposta che la query originale per decidere quali media mostrare
            media = engine.get_media(full_resp, user_input)
            render_media_section(media)
            
            st.session_state.messages.append({"role": "assistant", "content": final_text, "media": media})
    st.rerun()
