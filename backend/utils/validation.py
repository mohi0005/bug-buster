"""Validation & Security Utility Functions for NyayaAI.

Enforces strict input validation, prompt injection detection, PII detection, and file security checks.
"""

import re
from typing import List, Tuple
from fastapi import HTTPException, status
from backend.config import settings

# Prompt Injection Attack Patterns
PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|above)\s+(instructions|prompts|rules)",
    r"disregard\s+system\s+instructions",
    r"you\s+are\s+now\s+a\s+(dan|unrestricted|god\s+mode)",
    r"system\s*:\s*",
    r"<\|im_start\|>",
    r"\[SYSTEM_PROMPT\]",
    r"override\s+safety\s+guidelines",
    r"reveal\s+(your\s+)?(system\s+prompt|api\s+key|secret)",
]

# Sensitive PII Regex Patterns
PII_PATTERNS = {
    "Credit Card": r"\b(?:\d[ -]*?){13,16}\b",
    "SSN/National ID": r"\b\d{3}-\d{2}-\d{4}\b",
    "Email Address": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "Phone Number": r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
}


def sanitize_user_text(text: str) -> str:
    """Removes null bytes and harmful control characters from user text."""
    if not text:
        return ""
    # Strip null bytes and non-printable control characters (except standard newlines/tabs)
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    return cleaned.strip()


def validate_query_length(text: str, max_length: int = settings.MAX_INPUT_LENGTH) -> str:
    """Validates that text is non-empty and within maximum allowed length."""
    sanitized = sanitize_user_text(text)
    if not sanitized:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input query cannot be empty or contain only whitespace.",
        )
    if len(sanitized) > max_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Input length ({len(sanitized)} chars) exceeds maximum allowed limit of {max_length} characters.",
        )
    return sanitized


def detect_prompt_injection(text: str) -> Tuple[bool, List[str]]:
    """Scans text for known prompt injection directives.

    Returns:
        (is_injection_found, list_of_matched_patterns)
    """
    matches = []
    text_lower = text.lower()
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            matches.append(pattern)
    return len(matches) > 0, matches


def detect_pii(text: str) -> List[str]:
    """Scans text for sensitive personally identifiable information (PII).

    Returns:
        List of detected PII types.
    """
    detected = []
    for pii_type, pattern in PII_PATTERNS.items():
        if re.search(pattern, text):
            detected.append(pii_type)
    return detected


def validate_file_upload(
    filename: Optional[str],
    file_size_bytes: int,
    allowed_extensions: List[str] = settings.ALLOWED_EXTENSIONS,
    max_bytes: int = settings.MAX_FILE_SIZE_BYTES,
) -> str:
    """Validates uploaded file size and extension.

    Raises HTTPException on invalid files.
    """
    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing.",
        )

    # Check file size
    if file_size_bytes <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )
    if file_size_bytes > max_bytes:
        max_mb = max_bytes / (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds maximum limit of {max_mb:.1f} MB.",
        )


    # Extract extension
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not permitted. Allowed extensions: {', '.join(allowed_extensions)}",
        )

    return ext
