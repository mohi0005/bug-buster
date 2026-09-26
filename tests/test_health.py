"""Test Health Endpoint and Application Root."""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test scenario 1: Verify API health endpoint returns status 200 and expected schema."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "NyayaAI"
    assert "version" in data
    assert "ai_engine_mode" in data
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_root_endpoint():
    """Verify root status endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")

    assert response.status_code == 200
    assert "version" in response.json()
