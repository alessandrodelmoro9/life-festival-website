import logging
import asyncio
from core.engine import LifeRagEngine

# Override per testare senza fare chiamate reali a OpenRouter
class MockEngine(LifeRagEngine):
    def __init__(self):
        # Evitiamo di caricare modelli veri
        self.chat_engines = {}
        pass
        
def run_diagnostic():
    engine = LifeRagEngine() # Proviamo a usare quello vero, fa una query? No, faremo un test mock
    
    query = "chi parla sabato mattina"
    
    print("\n" + "="*50)
    print(f"DIAGNOSTIC TEST: {query}")
    print("="*50)
    
    intents = engine._detect_intents(query.lower())
    print(f"DETECTED INTENTS: {intents}")
    
    # Simulate LLM response
    response_text = "Ecco gli speaker di sabato mattina: Pippo [[REF:pippo]]"
    found_tags = ['pippo']
    
    # Copiamo la logica di asset resolution
    final_tag_ids = []
    
    if not intents["sponsor"]:
        if intents["friday"]:
            if intents["morning"] and not intents["afternoon"]:
                final_tag_ids.append("gallery-friday-morning")
            elif intents["afternoon"] and not intents["morning"]:
                final_tag_ids.append("gallery-friday-afternoon")
            else:
                final_tag_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon"])
        
        if intents["saturday"]:
            if intents["morning"] and not intents["afternoon"]:
                final_tag_ids.append("gallery-saturday-morning")
            elif intents["afternoon"] and not intents["morning"]:
                final_tag_ids.append("gallery-saturday-afternoon")
            else:
                final_tag_ids.extend(["gallery-saturday-morning", "gallery-saturday-afternoon"])

        if not (intents["friday"] or intents["saturday"]):
            if intents["total"] or intents["program"] or intents["speaker"]:
                final_tag_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"])

    for tag in found_tags:
        clean_tag = tag.lower().strip()
        if clean_tag not in final_tag_ids:
            final_tag_ids.append(clean_tag)
            
    print(f"FINAL TAG IDS prima di registry: {final_tag_ids}")

if __name__ == "__main__":
    run_diagnostic()
