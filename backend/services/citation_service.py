"""Citation & Grounding Service for NyayaAI.

Manages loading, matching, and retrieving verified legal sources from demo_sources.json.
"""

import json
from typing import List, Optional
from backend.config import settings
from backend.models import CitationModel


class CitationService:
    """Manages legal source knowledge base and citation retrieval."""

    def __init__(self, data_path: Optional[str] = None):
        self.data_file = data_path or str(settings.DATA_DIR / "demo_sources.json")
        self.sources: List[CitationModel] = []
        self._load_sources()

    def _load_sources(self) -> None:
        """Loads and parses legal demo sources from JSON file."""
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
                self.sources = [
                    CitationModel(
                        id=item["id"],
                        title=item["title"],
                        act_or_law=item["act_or_law"],
                        section=item["section"],
                        category=item.get("category", "general"),
                        summary=item["summary"],
                        verified=True,
                    )
                    for item in raw_data
                ]
        except Exception as e:
            # Fallback empty list if file error occurs
            self.sources = []

    def get_all_sources(self) -> List[CitationModel]:
        """Returns all available demo legal sources."""
        return self.sources

    def search_sources(self, query: str, category: Optional[str] = None, max_results: int = 3) -> List[CitationModel]:
        """Retrieves legal sources matching query terms and category."""
        if not self.sources:
            return []

        query_terms = set(query.lower().split())
        scored_sources = []

        for source in self.sources:
            score = 0
            # Category match bonus
            if category and source.category.lower() == category.lower():
                score += 3

            # Keyword matching against title, summary, act_or_law, section
            combined_text = (
                f"{source.title} {source.summary} {source.act_or_law} {source.section} {source.category}".lower()
            )

            for term in query_terms:
                if len(term) > 2 and term in combined_text:
                    score += 1

            if score > 0:
                scored_sources.append((score, source))

        # Sort descending by relevance score
        scored_sources.sort(key=lambda x: x[0], reverse=True)

        matched = [item[1] for item in scored_sources[:max_results]]

        # If no specific keyword matched, return top general sources
        if not matched:
            matched = self.sources[:2]

        return matched
