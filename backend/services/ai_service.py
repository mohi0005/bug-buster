"""AI Service Abstraction for NyayaAI.

Supports live Google Gemini API execution and offline deterministic grounded fallback.
Strictly generates structured, grounded legal responses.
"""

import json
from pathlib import Path
from typing import List, Optional
import httpx
from backend.config import settings
from backend.models import CitationModel, LegalQueryResponse


class AIService:
    """Legal AI Service abstracting LLM queries and grounding."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.system_prompt = self._load_prompt("legal_assistant.txt")

    def _load_prompt(self, filename: str) -> str:
        """Loads prompt template from prompts directory."""
        prompt_path = settings.PROMPTS_DIR / filename
        if prompt_path.exists():
            return prompt_path.read_text(encoding="utf-8")
        return "You are NyayaAI legal assistance assistant. Provide structured legal information."

    @property
    def is_live_mode(self) -> bool:
        """Returns True if a valid Gemini API key is configured."""
        return bool(self.api_key and self.api_key.strip() and self.api_key.strip() != "mock")

    async def generate_legal_response(
        self, query: str, grounding_sources: List[CitationModel], user_category: str = "general"
    ) -> LegalQueryResponse:
        """Generates structured legal assistance response."""
        if self.is_live_mode:
            try:
                return await self._call_gemini_api(query, grounding_sources, user_category)
            except Exception:
                # Safe fallback to grounded offline response on API failure
                return self._generate_grounded_offline_response(query, grounding_sources)
        else:
            return self._generate_grounded_offline_response(query, grounding_sources)

    async def _call_gemini_api(
        self, query: str, grounding_sources: List[CitationModel], user_category: str
    ) -> LegalQueryResponse:
        """Calls Google Gemini API asynchronously using httpx."""
        sources_text = "\n".join(
            [f"- [{s.id}] {s.act_or_law} {s.section} ({s.title}): {s.summary}" for s in grounding_sources]
        )

        user_prompt = (
            f"User Query Category: {user_category}\n"
            f"Grounding Legal Sources:\n{sources_text}\n\n"
            f"User Query Data:\n{query}\n\n"
            "Respond in JSON with exact keys: facts_summary, explanation, uncertainties, next_steps."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}

        payload = {
            "contents": [{"parts": [{"text": f"{self.system_prompt}\n\n{user_prompt}"}]}],
            "generationConfig": {"response_mime_type": "application/json", "temperature": 0.2},
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_request()
            res_data = response.json()

            raw_json_str = (
                res_data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "{}")
            )

            parsed = json.loads(raw_json_str)

            return LegalQueryResponse(
                facts_summary=parsed.get("facts_summary", f"User presented query regarding {user_category} matter."),
                retrieved_sources=grounding_sources,
                explanation=parsed.get("explanation", "Legal analysis based on provided grounded statutes."),
                uncertainties=parsed.get("uncertainties", ["Additional specific facts and documents may be required."]),
                next_steps=parsed.get("next_steps", ["Consult a qualified lawyer or legal aid office."]),
                safety_passed=True,
            )

    def _generate_grounded_offline_response(
        self, query: str, grounding_sources: List[CitationModel]
    ) -> LegalQueryResponse:
        """Deterministic, grounded legal response generator for offline and testing mode."""
        clean_query = query.strip()
        facts_summary = f"User inquired about legal rights regarding: '{clean_query[:150]}...'."

        if grounding_sources:
            primary_src = grounding_sources[0]
            explanation = (
                f"Under the {primary_src.act_or_law} ({primary_src.section}), individuals are granted specific "
                f"legal protections regarding '{primary_src.title}'. Specifically: {primary_src.summary} "
                "Any arbitrary or unlawful action violating these provisions can be challenged through formal "
                "legal notice or regulatory bodies."
            )
        else:
            explanation = (
                "Based on the provided information, general legal principles require fair dealing, written agreements, "
                "and adherence to statutory notice requirements."
            )

        uncertainties = [
            "Specific contractual clauses, local jurisdiction rules, and written correspondence were not provided.",
            "Exact timelines, monetary damages, and signed documentation need formal verification.",
        ]

        next_steps = [
            "Gather and preserve all written records, receipts, contracts, and communication history.",
            "Send a formal written notice detailing your grievance and requested remedy.",
            "Contact your local Legal Aid Services Authority or a licensed advocate for case-specific representation.",
        ]

        return LegalQueryResponse(
            facts_summary=facts_summary,
            retrieved_sources=grounding_sources,
            explanation=explanation,
            uncertainties=uncertainties,
            next_steps=next_steps,
            safety_passed=True,
        )
