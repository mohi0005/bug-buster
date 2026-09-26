"""Legal Assistance API Router for NyayaAI.

Handles legal queries, document uploads, and source knowledge base retrieval.
"""

from typing import List, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from backend.models import (
    CitationModel,
    DocumentAnalysisResponse,
    LegalQueryRequest,
    LegalQueryResponse,
)
from backend.services.ai_service import AIService
from backend.services.citation_service import CitationService
from backend.services.document_service import DocumentService
from backend.services.safety_service import SafetyService
from backend.utils.validation import validate_query_length

router = APIRouter(prefix="/legal", tags=["Legal Assistance"])

# Service Dependencies (Dependency Injection pattern)
ai_service = AIService()
citation_service = CitationService()
document_service = DocumentService()
safety_service = SafetyService()


@router.post("/query", response_model=LegalQueryResponse, summary="Submit Everyday Legal Query")
async def process_legal_query(request: LegalQueryRequest):
    """Processes a user's everyday legal question safely with source grounding."""
    # 1. Input Length & Sanitization Validation
    validated_query = validate_query_length(request.query)

    # 2. Pre-Execution Safety Analysis (Prompt Injection & PII scan)
    safety_result = safety_service.analyze_input_safety(validated_query)
    if not safety_result.is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Query rejected due to safety policy: {'; '.join(safety_result.flagged_reasons)}",
        )

    # 3. Grounding Source Retrieval
    retrieved_sources = citation_service.search_sources(
        query=validated_query, category=request.user_category, max_results=3
    )

    # 4. Legal AI Generation (Live Gemini or Grounded Offline)
    raw_response = await ai_service.generate_legal_response(
        query=safety_result.sanitized_text,
        grounding_sources=retrieved_sources,
        user_category=request.user_category or "general",
    )

    # 5. Post-Execution Safety Verification & Citation Grounding Check
    verified_response = safety_service.verify_response_safety(raw_response, citation_service.get_all_sources())

    return verified_response


@router.post("/analyze-document", response_model=DocumentAnalysisResponse, summary="Upload & Analyze Legal Document")
async def analyze_document(
    file: UploadFile = File(...),
    query: Optional[str] = Form(default="Analyze this legal document and explain key rights and terms."),
    user_category: Optional[str] = Form(default="general"),
):
    """Safely extracts document content and performs legal analysis."""
    # 1. Read file bytes
    file_bytes = await file.read()

    # 2. Parse document safely
    extracted_text, wrapped_data = document_service.parse_document(file.filename or "uploaded_doc.txt", file_bytes)

    # 3. Combine query and document wrapped data
    combined_query = f"{query}\n\nDocument Data:\n{wrapped_data}"

    # 4. Retrieve sources
    retrieved_sources = citation_service.search_sources(
        query=extracted_text, category=user_category, max_results=3
    )

    # 5. AI Service Generation
    raw_response = await ai_service.generate_legal_response(
        query=combined_query,
        grounding_sources=retrieved_sources,
        user_category=user_category or "general",
    )

    # 6. Post Verification
    verified_response = safety_service.verify_response_safety(raw_response, citation_service.get_all_sources())

    snippet = extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text

    return DocumentAnalysisResponse(
        file_name=file.filename or "uploaded_doc.txt",
        file_size_bytes=len(file_bytes),
        extracted_text_snippet=snippet,
        analysis=verified_response,
    )


@router.get("/sources", response_model=List[CitationModel], summary="List Knowledge Base Legal Sources")
async def list_legal_sources():
    """Returns all verified demo legal sources available in the local knowledge base."""
    return citation_service.get_all_sources()
