
import os
import dotenv
import re
from core.engine import LifeRagEngine

def mega_stress_test():
    dotenv.load_dotenv()
    engine = LifeRagEngine()
    
    test_cases = [
        {
            "name": "SOGLIA 7: Domanda specifica su pochi speaker",
            "q": "Cosa accomuna Simone Checchia, Ego55, Pierfilippo Ariano e Marco Oggian?",
            "expected_type": "individual", # Dovrebbe mostrare le foto singole perché < 7
            "forbidden": ["composite", "gallery-"]
        },
        {
            "name": "SOGLIA 7: Superamento soglia (>7)",
            "q": "Parlami di Simone Checchia, Ego55, Pierfilippo Ariano, Marco Oggian, Mauro Bubbico, Italo Sannino, Cosmico e Adoratorio Studio.",
            "expected_type": "composite", # > 7 entità, deve scattare la gallery
            "must_have": ["/assets/composite/"]
        },
        {
            "name": "INTENT: Richiesta totale (Banner)",
            "q": "Chi sono gli speaker del festival?",
            "expected_type": "composite", # Intent 'chi sono' + 'speaker' senza giorno = Tutte le gallery
            "must_have": ["5_giugno_mattina.webp", "6_giugno_pomeriggio.webp"]
        },
        {
            "name": "INTENT: Sponsor Esclusivo",
            "q": "Chi sono i partner e gli sponsor?",
            "expected_type": "composite", # Deve dare solo lo sponsor wall
            "must_have": ["Partner & Sponsor.webp"],
            "forbidden": ["composite/5_giugno", "composite/6_giugno"]
        },
        {
            "name": "TEMPORAL: Sabato Mattina",
            "q": "Cosa succede sabato mattina?",
            "expected_type": "composite", 
            "must_have": ["6_giugno_mattina.webp"],
            "forbidden": ["6_giugno_pomeriggio.webp", "5_giugno"]
        }
    ]
    
    print(f"\n🚀 AVVIO MEGA STRESS TEST - LIFE 2026")
    print(f"{'='*60}")
    
    for case in test_cases:
        print(f"\nTEST: {case['name']}")
        print(f"QUERY: {case['q']}")
        
        result = engine.query(case['q'])
        imgs = result['images']
        
        print(f"IMMAGINI ({len(imgs)}): {imgs}")
        
        # Valutazione
        success = True
        
        if case["expected_type"] == "individual":
            if any("composite" in img or "gallery" in img for img in imgs):
                print("❌ ERRORE: Ha mostrato le gallery composite invece delle foto singole.")
                success = False
            if len(imgs) == 0:
                print("❌ ERRORE: Nessuna immagine restituita.")
                success = False
                
        if case["expected_type"] == "composite":
            if not any("composite" in img or "Partner & Sponsor" in img for img in imgs):
                print("❌ ERRORE: Non ha mostrato i banner compositi.")
                success = False
            
        if "must_have" in case:
            for item in case["must_have"]:
                if not any(item in img for img in imgs):
                    print(f"❌ ERRORE: Manca l'immagine attesa: {item}")
                    success = False
                    
        if "forbidden" in case:
            for item in case["forbidden"]:
                if any(item in img for img in imgs):
                    print(f"❌ ERRORE: Trovata immagine vietata: {item}")
                    success = False
        
        if success:
            print("✅ TEST SUPERATO")
        print(f"{'-'*40}")

if __name__ == "__main__":
    mega_stress_test()
