import os
import google.generativeai as genai
import requests
from dotenv import load_dotenv

def check_all_models():
    load_dotenv()
    gemini_key = os.getenv('GOOGLE_API_KEY')
    openrouter_key = os.getenv('OPENROUTER_API_KEY')
    
    print("\n=== 1. TEST GOOGLE GEMINI ===")
    if not gemini_key:
        print("❌ GOOGLE_API_KEY non trovata.")
    else:
        try:
            genai.configure(api_key=gemini_key)
            print("\n[Embeddings]")
            for m in genai.list_models():
                if 'embedContent' in m.supported_generation_methods:
                    print(f"✅ {m.name}")
            
            print("\n[LLMs (Chat)]")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    # Filtriamo per gemini
                    if 'gemini' in m.name:
                        print(f"✅ {m.name}")
        except Exception as e:
            print(f"❌ Errore Google: {e}")

    print("\n=== 2. TEST OPENROUTER ===")
    if not openrouter_key:
        print("⚠️ OPENROUTER_API_KEY non trovata (opzionale).")
    else:
        try:
            # Testiamo la connessione chiedendo i modelli free disponibili
            response = requests.get("https://openrouter.ai/api/v1/models")
            if response.status_code == 200:
                models = response.json().get('data', [])
                print(f"\n[Modelli OpenRouter Free Rilevati]")
                free_models = [m['id'] for m in models if 'free' in m['id']]
                for fm in free_models[:10]: # Mostriamo i primi 10
                    print(f"✅ {fm}")
                
                # Verifichiamo il nostro modello specifico
                target = "google/gemini-flash-1.5-8b:free"
                if any(m['id'] == target for m in models):
                    print(f"\n✨ Modello Failover '{target}' DISPONIBILE.")
                else:
                    print(f"\n❌ Modello Failover '{target}' NON TROVATO.")
            else:
                print(f"❌ Errore OpenRouter (Status {response.status_code})")
        except Exception as e:
            print(f"❌ Errore OpenRouter: {e}")

if __name__ == "__main__":
    check_all_models()
