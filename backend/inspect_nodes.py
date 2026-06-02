
import os
import sys
import logging

# Aggiungiamo il percorso corrente per importare core
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.engine import LifeRagEngine

# Configuriamo il logger per vedere i nodi sorgente
logging.basicConfig(level=logging.INFO)

def inspect_rag_behavior():
    engine = LifeRagEngine()
    query_text = "Chi sono gli sponsor del festival?"
    
    print(f"\n🚀 ESEGUO QUERY DI TEST: '{query_text}'")
    
    # Simuliamo il processo di query ma ispezioniamo i nodi PRIMA della risposta finale
    chat_engine = engine.get_chat_engine("test_session")
    
    # 1. Vediamo come viene trasformato il messaggio (Phases 1 Injection)
    lower_msg = query_text.lower()
    intents = engine._detect_intents(lower_msg)
    enhanced_message = query_text
    if intents["sponsor"]:
        enhanced_message += "\n(MANDATORIO: Usa [[REF:global-partners]] come lista principale. Mostra SOLO sponsor.)"
    
    print(f"\n--- FASE 1: MESSAGGIO POTENZIATO (INJECTION) ---")
    print(enhanced_message)

    # 2. Eseguiamo la chat e analizziamo i Source Nodes
    response = chat_engine.chat(enhanced_message)
    
    print(f"\n--- FASE 2: NODI RECUPERATI (RETRIEVAL) ---")
    print(f"Totale nodi recuperati: {len(response.source_nodes)}")
    
    for i, node_with_score in enumerate(response.source_nodes):
        node = node_with_score.node
        score = node_with_score.score
        node_id = node.metadata.get('id', 'N/A')
        node_type = node.metadata.get('type', 'N/A')
        
        print(f"\n[{i+1}] ID: {node_id} | Tipo: {node_type} | Score: {score:.4f}")
        # Mostriamo le prime 2 righe del contenuto
        content_snippet = " ".join(node.get_content().splitlines()[:3])
        print(f"    Snippet: {content_snippet[:150]}...")

    print(f"\n--- FASE 3: RISPOSTA GENERATA (LLM) ---")
    print(f"Testo: {response.response[:200]}...")

if __name__ == "__main__":
    inspect_rag_behavior()
