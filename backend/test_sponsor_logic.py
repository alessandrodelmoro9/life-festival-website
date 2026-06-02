
import os
import sys
import logging

# Aggiungiamo il percorso corrente per importare core
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.engine import LifeRagEngine

# Disabilitiamo i log rumorosi
logging.getLogger("llama_index").setLevel(logging.ERROR)

def test_sponsors():
    engine = LifeRagEngine()
    print("\n--- TEST: CHI SONO GLI SPONSOR DEL FESTIVAL? ---")
    
    result = engine.query("Chi sono gli sponsor del festival?")
    
    print(f"\n[TEXT PREVIEW]: {result['text'][:200]}...")
    print(f"\n[IMAGES]: {result['images']}")
    print(f"\n[LINKS COUNT]: {len(result['links'])}")
    print(f"[LINKS LIST]: {result['links']}")
    
    # Verifica sponsor-wall
    if "/assets/logos/Partner & Sponsor.webp" in result['images']:
        print("\n✅ Sponsor Wall trovato correttamente!")
    else:
        print("\n❌ Sponsor Wall MANCANTE!")

    # Verifica numero link (aspettiamo ~22)
    if len(result['links']) >= 20:
        print(f"✅ Recupero link massivo riuscito ({len(result['links'])} link)!")
    else:
        print(f"⚠️ Recupero link parziale ({len(result['links'])} link).")

if __name__ == "__main__":
    test_sponsors()
