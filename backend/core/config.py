from pathlib import Path
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_DIR / "data"
KNOWLEDGE_DIR = BACKEND_DIR / "knowledge"
STORAGE_DIR = BACKEND_DIR / "storage"

DEV_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
]


class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = Field(...)

    ENV: str = "development"
    DEBUG: bool = False
    PORT: int = 8000

    MODEL_NAME: str = "google/gemini-2.5-flash"
    EMBED_MODEL_NAME: str = "text-embedding-3-small"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "https://lifedesignfestival.it",
        "https://www.lifedesignfestival.it",
        "https://life-design-scroll.vercel.app",
    ]

    MAX_MESSAGE_LENGTH: int = 500
    MAX_SESSIONS: int = 500
    SESSION_TTL_SECONDS: int = 3600

    @property
    def cors_origins(self) -> List[str]:
        if self.ENV.lower() == "production":
            return [o for o in self.ALLOWED_ORIGINS if o not in DEV_ORIGINS]
        return list(dict.fromkeys([*self.ALLOWED_ORIGINS, *DEV_ORIGINS]))

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
