"""Test Citation Grounding, Verification, and Knowledge Base Matching."""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app
from backend.models import CitationModel, LegalQueryResponse
from backend.services.citation_service import CitationService
from backend.services.safety_service import SafetyService


@pytest.mark.asyncio
async def test_sources_list_endpoint():
    """Verify listing all knowledge base demo sources."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/legal/sources")

    assert response.status_code == 200
    sources = response.json()
    assert isinstance(sources, list)
    assert len(sources) >= 4


def test_citation_keyword_matching():
    """Verify searching sources by keywords returns accurate legal acts."""
    citation_serv = CitationService()

    # Search tenancy query
    tenant_sources = citation_serv.search_sources(query="landlord eviction water supply rent", category="tenants")
    assert len(tenant_sources) > 0
    assert any("Tenancy" in s.act_or_law or "Tenant" in s.title for s in tenant_sources)

    # Search labor query
    labor_sources = citation_serv.search_sources(query="unpaid salary termination wages employer", category="labor")
    assert len(labor_sources) > 0
    assert any("Wages" in s.act_or_law or "Employee" in s.title for s in labor_sources)


def test_citation_hallucination_verification():
    """Test scenario 12: Safety service flags unverified / hallucinated citations."""
    safety_serv = SafetyService()

    valid_src = CitationModel(
        id="SRC-CONSUMER-2019-S2",
        title="Consumer Rights",
        act_or_law="Consumer Protection Act, 2019",
        section="Section 2(47)",
        category="consumer",
        summary="Protection against unfair trade.",
        verified=True,
    )

    fake_src = CitationModel(
        id="SRC-FAKE-STATUTE-999",
        title="Fabricated Act",
        act_or_law="Invented Law, 2099",
        section="Section 999",
        category="general",
        summary="Invented summary.",
        verified=True,
    )

    dummy_response = LegalQueryResponse(
        facts_summary="Facts summary",
        retrieved_sources=[valid_src, fake_src],
        explanation="Explanation text",
        uncertainties=[],
        next_steps=[],
        safety_passed=True,
    )

    verified = safety_serv.verify_response_safety(dummy_response, [valid_src])

    # Verified source should remain valid
    assert verified.retrieved_sources[0].verified is True
    # Fake source must be flagged as unverified
    assert verified.retrieved_sources[1].verified is False
    assert "[UNVERIFIED CITATION]" in verified.retrieved_sources[1].title
