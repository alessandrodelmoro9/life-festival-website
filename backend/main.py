import os
import sys
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.engine import LifeRagEngine

load_dotenv()

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Traccia AI - LIFE Design Festival 2026")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure Strict CORS
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "https://lifedesignfestival.it",
    "https://www.lifedesignfestival.it",
    "https://life-design-scroll.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize RAG Engine
try:
    rag_engine = LifeRagEngine()
    logger.info("✨ LifeRagEngine initialized successfully")
except Exception as e:
    logger.error(f"CRITICAL: Failed to initialize RAG Engine: {e}")
    rag_engine = None

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    text: str
    images: list[str] = []
    links: list[str] = []
    source: str

@app.get("/")
async def root():
    return {"status": "online", "model": "Gemini 2.0 Flash via OpenRouter"}

@app.get("/health")
async def health():
    return {"status": "healthy", "engine": "ready" if rag_engine else "down"}

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, chat_request: ChatRequest):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        # Pass both message and session_id for memory
        result = rag_engine.query(chat_request.message, session_id=chat_request.session_id)
        return ChatResponse(**result)
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Render binds to $PORT
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
