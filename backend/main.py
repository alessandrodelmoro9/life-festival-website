import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Add current directory to path to ensure core module is found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.engine import LifeRagEngine

# Load environment variables
load_dotenv()

app = FastAPI(title="LIFE Design Festival 2026 - API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine
try:
    rag_engine = LifeRagEngine()
    print("✨ RAG Engine initialized successfully")
except Exception as e:
    print(f"CRITICAL: Failed to initialize RAG Engine: {e}")
    rag_engine = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str
    images: list[str] = []
    links: list[str] = []
    source: str

@app.get("/")
async def root():
    return {"status": "online", "message": "LIFE 2026 RAG API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        result = rag_engine.query(request.message)
        return ChatResponse(**result)
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
