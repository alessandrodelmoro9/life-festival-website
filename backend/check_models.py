import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def check_openrouter_status():
    api_key = os.getenv("OPENROUTER_API_KEY")
    base_url = "https://openrouter.ai/api/v1"
    
    print(f"--- OpenRouter Diagnostics ---")
    print(f"API Key present: {'Yes' if api_key else 'No'}")
    
    # 1. Fetch all models
    print("\n1. Fetching full model list...")
    try:
        response = requests.get(f"{base_url}/models")
        if response.status_code == 200:
            models = response.json().get('data', [])
            gemini_models = [m for m in models if 'gemini' in m.get('id', '').lower()]
            
            print(f"Found {len(gemini_models)} Gemini models:")
            for m in gemini_models:
                m_id = m.get('id')
                name = m.get('name')
                # Pricing is usually in m['pricing'] or similar, let's look for it
                pricing = m.get('pricing', {})
                prompt = pricing.get('prompt', 'N/A')
                completion = pricing.get('completion', 'N/A')
                print(f"  - ID: {m_id:<40} | Name: {name:<30} | Price (P/C): {prompt}/{completion}")
        else:
            print(f"Error fetching models: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Exception during model fetch: {e}")

    # 2. Test connectivity with a simple Gemini prompt
    print("\n2. Testing connectivity with google/gemini-flash-1.5...")
    test_slugs = ["google/gemini-flash-1.5", "google/gemini-flash-latest", "google/gemini-flash-1.5-8b"]
    
    for slug in test_slugs:
        print(f"Testing {slug}...")
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": slug,
                "messages": [{"role": "user", "content": "Hi"}],
                "max_tokens": 5
            }
            res = requests.post(f"{base_url}/chat/completions", headers=headers, json=data)
            if res.status_code == 200:
                print(f"  SUCCESS: {slug} is responding.")
            else:
                print(f"  FAILED: {slug} returned {res.status_code} - {res.json().get('error', {}).get('message', 'No error message')}")
        except Exception as e:
            print(f"  EXCEPTION: {slug} -> {e}")

if __name__ == "__main__":
    check_openrouter_status()
