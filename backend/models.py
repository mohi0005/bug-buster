"""Pydantic Models & Data Schemas for NyayaAI.

Enforces strict input validation, type hinting, and structured output formatting.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class LegalQueryRequest(BaseModel):
    """User legal query request payload."""

    query: str = Field(
        ...,
        description="The everyday language legal question or situation description.",
        min_length=3,
        max_length=4000,
        examples=["My landlord cut off my water supply because of a rent dispute. What are my rights?"],
    )
    user_category: Optional[str] = Field(
        default="general",
        description="Optional category focus: tenant, labor, consumer, privacy, general.",
    )

    @field_validator("query")
    @classmethod
    def validate_query_text(cls, value: str) -> str:
        """Strip whitespace and reject empty string after trimming."""
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Query string cannot be blank or only whitespace.")
        return trimmed


class CitationModel(BaseModel):
    """Model representing a verified legal source citation."""

    id: str = Field(..., description="Unique source identifier")
    title: str = Field(..., description="Short title of the legal concept")
    act_or_law: str = Field(..., description="Official name of the Act or Law")
    section: str = Field(..., description="Relevant section or clause")
    category: str = Field(..., description="Legal category")
    summary: str = Field(..., description="Concise legal provision summary")
    verified: bool = Field(default=True, description="Whether citation is verified against database")


class SafetyAnalysisResult(BaseModel):
    """Result of safety pre-execution analysis."""

    is_safe: bool = Field(..., description="Whether input passed safety checks")
    flagged_reasons: List[str] = Field(default_factory=list, description="Reasons if flagged")
    detected_pii: List[str] = Field(default_factory=list, description="Detected sensitive personal info")
    sanitized_text: str = Field(..., description="Sanitized input string")


class LegalQueryResponse(BaseModel):
    """Structured, grounded response model for legal assistance."""

    facts_summary: str = Field(..., description="Objective summary of user-provided facts")
    retrieved_sources: List[CitationModel] = Field(..., description="Verified legal sources grounding the response")
    explanation: str = Field(..., description="Plain-language legal concepts and rights explanation")
    uncertainties: List[str] = Field(..., description="Identified factual gaps and legal uncertainties")
    next_steps: List[str] = Field(..., description="Actionable practical next steps and how to find assistance")
    disclaimer: str = Field(
        default="LEGAL INFORMATION DISCLAIMER: NyayaAI is an AI-powered legal information tool, NOT a lawyer or substitute for legal advice. Consult a qualified legal professional for formal legal assistance.",
        description="Mandatory legal disclaimer",
    )
    safety_passed: bool = Field(default=True, description="Safety check status")


class DocumentAnalysisResponse(BaseModel):
    """Response model for uploaded document analysis."""

    file_name: str = Field(..., description="Original filename")
    file_size_bytes: int = Field(..., description="Processed file size in bytes")
    extracted_text_snippet: str = Field(..., description="First 200 chars of extracted text")
    analysis: LegalQueryResponse = Field(..., description="Legal query analysis of the document content")


class HealthStatusResponse(BaseModel):
    """API health status response."""

    status: str = Field(default="healthy", description="API health status")
    app_name: str = Field(..., description="Application name")
    version: str = Field(..., description="Application version")
    ai_engine_mode: str = Field(..., description="AI engine mode (gemini_live or offline_grounded)")
    timestamp: str = Field(..., description="Server timestamp")
