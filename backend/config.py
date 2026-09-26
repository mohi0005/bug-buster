"""Centralized Configuration Module for NyayaAI Backend.

Loads environment variables using Pydantic Settings with strict validation and safe defaults.
"""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable bindings."""

    # Project Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    PROMPTS_DIR: Path = BASE_DIR / "prompts"

    # Application Settings
    APP_NAME: str = "NyayaAI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # Security Constraints
    MAX_INPUT_LENGTH: int = 4000
    MAX_FILE_SIZE_BYTES: int = 2 * 1024 * 1024  # 2MB Limit
    ALLOWED_EXTENSIONS: List[str] = [".txt", ".pdf", ".md"]
    RATE_LIMIT_PER_MINUTE: int = 60

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:8501",
        "http://127.0.0.1:8501",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    # Secrets (Loaded ONLY from Environment Variables, never hardcoded)
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


# Instantiate single configuration instance
settings = Settings()
