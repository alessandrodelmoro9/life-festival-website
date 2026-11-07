import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from core.config import settings
from core.engine import LifeRagEngine

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="LIFE Design Festival AI - API",
    debug=settings.DEBUG,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "HEAD", "POST"],
    allow_headers=["Content-Type"],
)

rag_engine = LifeRagEngine()
logger.info("LifeRagEngine initialized successfully with model %s", settings.MODEL_NAME)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=settings.MAX_MESSAGE_LENGTH)
    session_id: str = Field("default", max_length=64)


class ChatResponse(BaseModel):
    text: str
    images: list[str] = []
    links: list[str] = []
    source: str


@app.get("/")
def root():
    return {"status": "ok"}


@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(request: Request, chat_request: ChatRequest):
    return ChatResponse(**rag_engine.query(chat_request.message, session_id=chat_request.session_id))


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting server on port %d", settings.PORT)
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
