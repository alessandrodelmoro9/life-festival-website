
import os
import dotenv
import re
from core.engine import LifeRagEngine

def stress_test():
    dotenv.load_dotenv()
    engine = LifeRagEngine()
    
    test_cases = [
        {"q": "Chi parla il 6 giugno?", "expected": ["gallery-saturday-morning", "gallery-saturday-afternoon"], "forbidden": ["gallery-friday"]},
        {"q": "Chi sono gli speaker del festival?", "expected": ["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"], "forbidden": ["sponsor-wall"]},
        {"q": "Chi sono gli sponsor?", "expected": ["sponsor-wall"], "forbidden": ["gallery-friday", "gallery-saturday"]},
        {"q": "Programma venerdì mattina", "expected": ["gallery-friday-morning"], "forbidden": ["afternoon", "saturday"]},
        {"q": "Cosa succede sabato pomeriggio?", "expected": ["gallery-saturday-afternoon"], "forbidden": ["morning", "friday"]},
    ]
    
    for case in test_cases:
        print(f"\n{'='*60}")
        print(f"QUERY: {case['q']}")
        result = engine.query(case['q'])
        
        imgs = result['images']
        print(f"IMMAGINI RESTITUITE: {imgs}")
        
        # Validation
        found_expected = all(any(exp in img for img in imgs) for exp in case['expected'])
        found_forbidden = any(any(forb in img for img in imgs) for forb in case['forbidden'])
        
        if found_expected and not found_forbidden:
            print("✅ RISULTATO PERFETTO")
        else:
            if not found_expected:
                print(f"❌ MANCANO GALLERY ATTESE: {case['expected']}")
            if found_forbidden:
                print(f"❌ TROVATE GALLERY NON RICHIESTE: {case['forbidden']}")

if __name__ == "__main__":
    stress_test()
