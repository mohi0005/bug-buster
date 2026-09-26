"""Safety Service for NyayaAI.

Enforces prompt-injection defense, input wrapping, PII warnings, and post-generation response safety validation.
"""

from typing import List
from backend.models import CitationModel, LegalQueryResponse, SafetyAnalysisResult
from backend.utils.validation import (
    detect_pii,
    detect_prompt_injection,
    sanitize_user_text,
)


class SafetyService:
    """Service handling pre-execution input analysis and post-execution safety verification."""

    def analyze_input_safety(self, text: str) -> SafetyAnalysisResult:
        """Pre-processes input text, checks for prompt injection and PII, and returns wrapped data."""
        sanitized = sanitize_user_text(text)
        is_injection, injection_patterns = detect_prompt_injection(sanitized)
        detected_pii = detect_pii(sanitized)

        flagged_reasons: List[str] = []
        if is_injection:
            flagged_reasons.append("Potential prompt injection attempt detected.")
        if detected_pii:
            flagged_reasons.append(f"Sensitive PII detected: {', '.join(detected_pii)}.")

        # Wrap untrusted text strictly inside XML tags to prevent system prompt pollution
        safe_data_wrapped = f"<untrusted_user_input>\n{sanitized}\n</untrusted_user_input>"

        return SafetyAnalysisResult(
            is_safe=not is_injection,
            flagged_reasons=flagged_reasons,
            detected_pii=detected_pii,
            sanitized_text=safe_data_wrapped,
        )

    def verify_response_safety(
        self, response: LegalQueryResponse, valid_sources: List[CitationModel]
    ) -> LegalQueryResponse:
        """Post-execution verification of generated legal responses.

        Enforces:
        - Non-lawyer disclaimer presence
        - No lawyer impersonation
        - Citation verification against valid grounding sources
        """
        # 1. Enforce disclaimer presence
        if "LEGAL INFORMATION DISCLAIMER" not in response.disclaimer.upper():
            response.disclaimer = (
                "LEGAL INFORMATION DISCLAIMER: NyayaAI is an AI-powered legal information tool, "
                "NOT a lawyer or substitute for legal advice. Consult a qualified legal professional."
            )

        # 2. Check for prohibited lawyer claims in explanation
        prohibited_phrases = ["i am your lawyer", "as your attorney", "legal advice", "represent you in court"]
        explanation_lower = response.explanation.lower()
        for phrase in prohibited_phrases:
            if phrase in explanation_lower:
                response.explanation = response.explanation.replace(
                    phrase, "an AI legal information provider"
                )

        # 3. Verify citations against grounding source list
        valid_source_ids = {s.id for s in valid_sources}
        verified_citations: List[CitationModel] = []

        for citation in response.retrieved_sources:
            if citation.id in valid_source_ids:
                citation.verified = True
                verified_citations.append(citation)
            else:
                # Flag unverified / hallucinated citations
                citation.verified = False
                citation.title = f"[UNVERIFIED CITATION] {citation.title}"
                verified_citations.append(citation)

        response.retrieved_sources = verified_citations
        response.safety_passed = True
        return response
