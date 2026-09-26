"""Test Input Validation, Length Limits, Malformed Requests, and PII Handling."""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app
from backend.utils.validation import detect_pii, sanitize_user_text


@pytest.mark.asyncio
async def test_valid_user_input():
    """Test scenario 2: Valid legal query input returns structured 200 response."""
    payload = {
        "query": "My landlord cut off my water supply because of a deposit dispute. What are my legal rights?",
        "user_category": "tenants",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/legal/query", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "facts_summary" in data
    assert "retrieved_sources" in data
    assert len(data["retrieved_sources"]) > 0
    assert "explanation" in data
    assert "uncertainties" in data
    assert "next_steps" in data
    assert "disclaimer" in data


@pytest.mark.asyncio
async def test_empty_input_rejection():
    """Test scenario 3: Empty query or whitespace input returns 400 Bad Request."""
    payload = {"query": "   ", "user_category": "general"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/legal/query", json=payload)

    assert response.status_code == 422 or response.status_code == 400


@pytest.mark.asyncio
async def test_excessively_long_input():
    """Test scenario 4: Input exceeding maximum 4000 character limit returns 400 or 422 Unprocessable Entity."""
    long_query = "law " * 1500  # 6000 characters
    payload = {"query": long_query, "user_category": "general"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/legal/query", json=payload)

    assert response.status_code in (400, 422)



@pytest.mark.asyncio
async def test_malformed_request_payload():
    """Test scenario 9: Malformed request payload returns clean 422 Unprocessable Entity."""
    malformed_json = {"invalid_key_name": 12345}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/legal/query", json=malformed_json)

    assert response.status_code == 422
    assert response.json()["error"] == "Unprocessable Entity"


def test_sensitive_pii_detection():
    """Test scenario 11: Sensitive PII (SSN, Credit Card, Email, Phone) detection."""
    sample_with_pii = (
        "My SSN is 123-45-6789 and my email is testuser@example.com. Phone number is 555-123-4567."
    )
    detected = detect_pii(sample_with_pii)
    assert "SSN/National ID" in detected
    assert "Email Address" in detected
    assert "Phone Number" in detected


def test_sanitize_control_characters():
    """Verify null byte and unsafe control character stripping."""
    unsafe_text = "Legal text\x00 with null\x07 byte"
    cleaned = sanitize_user_text(unsafe_text)
    assert "\x00" not in cleaned
    assert "\x07" not in cleaned
