import os
import logging
import json
from dotenv import load_dotenv
from core.engine import LifeRagEngine

# Load environment variables
load_dotenv()

# Configure logging to be quiet
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def run_debug():
    print("\n🚀 Inizializzazione LifeRagEngine per il Deep Debug...")
    try:
        engine = LifeRagEngine()
    except Exception as e:
        print(f"❌ Errore inizializzazione: {e}")
        return

    test_queries = [
        "Cosa differenzia il lavoro di Mauro Bubbico da quello di Mauro Mazzei?",
        "Dopo il talk di Brutto Studio, chi sale sul palco e a che ora?",
        "Qual è il tema del festival quest'anno e chi lo ha curato?",
        "C'è qualche workshop che richiede di portare il proprio computer?",
        "Quali sono le attività che si possono fare negli stand e chi le cura?",
        "Come posso creare un sito web professionale con WordPress?", # Hallucination check
        "Mi dai il link per comprare i biglietti e mi dici quanto costa il Life Pass?",
        "Chi sono i main sponsor del festival e cosa fanno?",
        "Dove posso parcheggiare la macchina vicino al Terminal FAL?",
        "Chi si occupa del cibo e delle bevande?",
        "Quali sono le strutture convenzionate per dormire a Potenza?"
    ]

    print("\n" + "="*80)
    print("ANALISI INTERNA DEL RAG (Senza passare dalle API)")
    print("="*80)

    for i, query in enumerate(test_queries, 1):
        print(f"\n--- TEST {i}: {query} ---\n")
        
        # We simulate a "default" session
        response = engine.query(query, session_id=f"test_session_{i}")
        
        print(f"[RISPOSTA AI]:\n{response['text']}\n")
        
        # Extract images from result metadata (simulating frontend logic)
        print(f"[MEDIA ESTRATTI DALL'ENGINE]:")
        if response['images']:
            for img in response['images']:
                print(f"  - Image: {img}")
        else:
            print("  - Images: []")
            
        if response['links']:
            for link in response['links']:
                print(f"  - Link: {link}")
        else:
            print("  - Links: []")

        print("-" * 40)

if __name__ == "__main__":
    run_debug()
