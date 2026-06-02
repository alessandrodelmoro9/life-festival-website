import logging
from core.engine import LifeRagEngine

# Setup basic logging to see the engine outputs
logging.basicConfig(level=logging.INFO)

def run_diagnostic():
    engine = LifeRagEngine()
    
    test_queries = [
        "Chi è Samuela Vaccari?",
        "Cosa succede venerdì mattina?",
        "Chi sono gli sponsor?",
        "Programma di sabato pomeriggio",
        "Chi parla sabato?",
        "Tutto il programma"
    ]
    
    print("\n" + "="*50)
    print("DIAGNOSTIC TEST: INTENT DETECTION & ASSET RESOLUTION")
    print("="*50)
    
    for query in test_queries:
        print(f"\nQUERY: {query}")
        # We manually call _detect_intents to see what's happening
        intents = engine._detect_intents(query.lower())
        print(f"DETECTED INTENTS: {intents}")
        
        result = engine.query(query)
        print(f"TEXT PREVIEW: {result['text'][:100]}...")
        print(f"IMAGES RETURNED: {result['images']}")
        print(f"LINKS RETURNED: {result['links']}")
        print(f"SOURCE MODEL: {result['source']}")
        print("-" * 30)

if __name__ == "__main__":
    run_diagnostic()
