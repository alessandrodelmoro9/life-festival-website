import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.config import settings
from core.engine import LifeRagEngine

# Setup logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="LIFE Design Festival AI - API",
    version="1.0.0",
    debug=settings.DEBUG
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS from Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize RAG Engine
try:
    rag_engine = LifeRagEngine()
    logger.info(f"✨ LifeRagEngine initialized successfully with model {settings.MODEL_NAME}")
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
    return {
        "status": "online", 
        "model": settings.MODEL_NAME,
        "environment": settings.ENV
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "engine": "ready" if rag_engine else "down"
    }

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(request: Request, chat_request: ChatRequest):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        result = rag_engine.query(chat_request.message, session_id=chat_request.session_id)
        return ChatResponse(**result)
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during chat processing")

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on port {settings.PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
