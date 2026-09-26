"""Main FastAPI Application Entry Point for NyayaAI.

Configures application middleware, exception handlers, security headers, and router endpoints.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.api.health import router as health_router
from backend.api.legal import router as legal_router
from backend.config import settings

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("nyaya_ai")

# Instantiate FastAPI Application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="NyayaAI — Secure AI-Assisted Legal Information & Access Platform.",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Global Exception Handler for Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Sanitizes Pydantic input validation errors without leaking sensitive internal details."""
    logger.warning(f"Validation error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Unprocessable Entity",
            "message": "Invalid request payload format or parameters.",
            "details": [str(err.get("msg")) for err in exc.errors()],
        },
    )


# Global Catch-All Exception Handler (Security Protection against Stack Trace Leaks)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Prevents stack traces and secrets from leaking to clients on 500 internal errors."""
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your legal query. Please try again later.",
        },
    )


# Mount Routers
app.include_router(health_router, prefix="/api/v1")
app.include_router(legal_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root status endpoint."""
    return {"message": "Welcome to NyayaAI API. Visit /docs for API documentation.", "version": settings.VERSION}
