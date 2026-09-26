"""Document Processing Service for NyayaAI.

Safely parses text, markdown, and PDF documents, enforcing strict size limits and prompt injection boundaries.
"""

import io
from typing import Tuple
from fastapi import HTTPException, status
from pypdf import PdfReader
from backend.config import settings
from backend.utils.validation import sanitize_user_text, validate_file_upload


class DocumentService:
    """Service handling safe extraction of document content."""

    MAX_EXTRACTED_CHARS = 8000

    def parse_document(self, filename: str, file_bytes: bytes) -> Tuple[str, str]:
        """Validates and extracts plain text from uploaded files.

        Returns:
            (extracted_text, wrapped_safe_data)
        """
        # 1. Validate file size and extension
        ext = validate_file_upload(filename, len(file_bytes))

        extracted_text = ""

        # 2. Safe parsing based on file type
        try:
            if ext in [".txt", ".md"]:
                extracted_text = file_bytes.decode("utf-8", errors="replace")

            elif ext == ".pdf":
                pdf_file = io.BytesIO(file_bytes)
                reader = PdfReader(pdf_file)
                pages_text = []
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        pages_text.append(text)
                extracted_text = "\n".join(pages_text)

            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported file extension '{ext}'",
                )

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Failed to process document: {str(e)}",
            )

        # 3. Sanitize and truncate extracted text
        sanitized = sanitize_user_text(extracted_text)
        if not sanitized:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document contains no readable text content.",
            )

        if len(sanitized) > self.MAX_EXTRACTED_CHARS:
            sanitized = sanitized[: self.MAX_EXTRACTED_CHARS] + "\n[... Document truncated due to length limits ...]"

        # 4. Wrap strictly inside XML data boundary
        wrapped_data = f"<untrusted_document_data filename=\"{filename}\">\n{sanitized}\n</untrusted_document_data>"

        return sanitized, wrapped_data
