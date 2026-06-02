
import os
import sys
import logging

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from core.engine import LifeRagEngine

# Logger minimale
logging.basicConfig(level=logging.ERROR)

def run_test_case(engine, name, query, expected_registry=None, expected_min_links=0, expected_galleries=0):
    print(f"\n--- TEST: {name} ---")
    print(f"Query: '{query}'")
    
    # Ispezioniamo i nodi interni prima di pulire la risposta
    chat_engine = engine.get_chat_engine("test_session")
    
    # Rilevamento intenti per la simulazione
    intents = engine._detect_intents(query.lower())
    enhanced_msg = query
    if intents["sponsor"]: enhanced_msg += "\n(MANDATORIO: Usa [[REF:global-partners]])"
    elif intents["speaker"]: enhanced_msg += "\n(MANDATORIO: Usa [[REF:registry-speakers]])"
    
    response = chat_engine.chat(enhanced_msg)
    final_result = engine.query(query) # Per testare anche il post-processing
    
    # 1. Verifica Retrieval (Registry-First)
    top_node_id = response.source_nodes[0].node.metadata.get('id', 'N/A')
    is_registry_first = expected_registry in [n.node.metadata.get('id') for n in response.source_nodes[:3]]
    
    print(f"  [RETRIEVAL] Top Node: {top_node_id}")
    if is_registry_first:
        print(f"  ✅ Registry '{expected_registry}' trovato nei primi 3 nodi.")
    else:
        print(f"  ❌ Registry '{expected_registry}' NON trovato nei primi nodi.")

    # 2. Verifica Asset
    num_imgs = len(final_result['images'])
    print(f"  [ASSETS] Immagini: {num_imgs} | Gallerie composite: {len([i for i in final_result['images'] if 'composite' in i])}")
    if expected_galleries > 0 and len([i for i in final_result['images'] if 'composite' in i]) >= expected_galleries:
        print(f"  ✅ Gallerie corrette.")
    
    # 3. Verifica Link
    num_links = len(final_result['links'])
    print(f"  [LINKS] Trovati: {num_links}")
    if num_links >= expected_min_links:
        print(f"  ✅ Numero link soddisfacente (min: {expected_min_links}).")
    else:
        print(f"  ❌ Troppi pochi link ({num_links}).")

if __name__ == "__main__":
    engine = LifeRagEngine()
    
    # Scenario 1: Sponsor Globali
    run_test_case(engine, "SPONSOR TOTALI", "Chi sono gli sponsor del festival?", 
                  expected_registry="global-partners", expected_min_links=20, expected_galleries=1)

    # Scenario 2: Speaker Globali
    run_test_case(engine, "SPEAKER TOTALI", "Chi sono tutti gli speaker del festival?", 
                  expected_registry="registry-speakers", expected_min_links=20, expected_galleries=4)

    # Scenario 3: Giorno specifico
    run_test_case(engine, "VENERDÌ MATTINA", "Cosa succede venerdì mattina?", 
                  expected_registry=None, expected_min_links=1, expected_galleries=1)

    # Scenario 4: Speaker Singolo
    run_test_case(engine, "SPEAKER SINGOLO", "Chi è Mauro Bubbico?", 
                  expected_registry=None, expected_min_links=1, expected_galleries=0)
