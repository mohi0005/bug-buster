"""Health Check Router for NyayaAI API."""

from datetime import datetime, timezone
from fastapi import APIRouter
from backend.config import settings
from backend.models import HealthStatusResponse
from backend.services.ai_service import AIService

router = APIRouter(tags=["Health"])
ai_service = AIService()


@router.get("/health", response_model=HealthStatusResponse, summary="Get API Health & Status")
async def health_check():
    """Returns application health, version, AI engine mode, and server timestamp."""
    engine_mode = "gemini_live" if ai_service.is_live_mode else "offline_grounded"
    return HealthStatusResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.VERSION,
        ai_engine_mode=engine_mode,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

