import os
import asyncio
import logging
from dotenv import load_dotenv
from core.engine import LifeRagEngine

# Silenziamo il logging per leggere meglio l'output dello stress test
logging.basicConfig(level=logging.ERROR)

async def run_extreme_stress_test():
    load_dotenv()
    print("🚀 Inizializzazione LifeRagEngine per EXTREME STRESS TEST...")
    try:
        engine = LifeRagEngine()
    except Exception as e:
        print(f"❌ Errore critico: {e}")
        return
    
    scenarios = [
        {
            "name": "REASONING MULTI-ATTRIBUTO (Premi + Abstract)",
            "query": "Quale studio ha vinto premi come 'Agency of the Year' nel 2023 e di cosa parlerà il suo relatore?",
            "goal": "Deve identificare AUGE Design e collegare il premio alla bio e al talk 'Parabola di un progetto'."
        },
        {
            "name": "CONFLITTO DI ORARIO (Logistica)",
            "query": "Posso vedere tutto il talk di Rocketpanda e poi andare all'inizio del workshop di Zetafonts sabato pomeriggio?",
            "goal": "Rocketpanda è 16:05-16:25. Workshop Zetafonts è 13:30-15:30. Deve capire che il workshop FINISCE prima del talk."
        },
        {
            "name": "IDENTIFICAZIONE FOUNDER (Mapping)",
            "query": "Chi è Camilla Zampolini e quale traccia lascia al festival?",
            "goal": "Deve mappare Camilla a Adoratorio Studio e parlare del talk su Radio Alice."
        },
        {
            "name": "FILTRO PREZZO E CATEGORIA",
            "query": "Ci sono attività o workshop gratuiti sabato pomeriggio?",
            "goal": "Deve controllare i prezzi dei workshop di sabato. (Zetafonts è a pagamento, Junk Journal è un'attività stand)."
        },
        {
            "name": "ALLUCINAZIONE INCROCIATA (Confusione Speaker)",
            "query": "Cosa dice Marco Oggian riguardo al futuro dei caratteri tipografici serif?",
            "goal": "TRICK: Oggian parla di 'Creare oltre confine'. Zetafonts parla di tipografia. L'AI non deve confonderli."
        },
        {
            "name": "TEST INCLUSIVITÀ E TONO",
            "query": "Ciao! Sono unə giovane creativə, perché dovrei partecipare al LIFE?",
            "goal": "Verificare l'uso della Schwa e la capacità di persuasione basata sulla 'Visione'."
        }
    ]

    print("\n" + "🔥" * 30)
    print("     LIFE DESIGN FESTIVAL - EXTREME RAG TEST")
    print("🔥" * 30)

    for i, scenario in enumerate(scenarios, 1):
        print(f"\n[TEST {i}] {scenario['name']}")
        print(f"Domanda: \"{scenario['query']}\"")
        
        start = asyncio.get_event_loop().time()
        response = engine.query(scenario['query'])
        end = asyncio.get_event_loop().time()
        
        print(f"\n🤖 Risposta ({end-start:.2f}s):")
        print(f"{response['text']}")
        
        print(f"\n📦 Metadata Estratti:")
        print(f"  📸 Immagini: {response['images']}")
        print(f"  🔗 Links: {response['links']}")
        print("-" * 50)

if __name__ == "__main__":
    asyncio.run(run_extreme_stress_test())
