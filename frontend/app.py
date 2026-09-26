"""Streamlit Frontend Application for NyayaAI.

Provides an accessible, high-contrast, interactive interface for AI-assisted legal access.
"""

import os
import httpx
import streamlit as st

# Page Configuration for Accessibility & Responsive Design
st.set_page_config(
    page_title="NyayaAI — Legal Assistance & Access",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom High-Contrast, Accessible CSS Theme
CUSTOM_ACCESSIBLE_CSS = """
<style>
    /* High contrast accessible typography and buttons */
    .stApp {
        font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .main-header {
        color: #0d47a1;
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        color: #37474f;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
    .disclaimer-box {
        background-color: #fff3cd;
        border-left: 6px solid #ffeba2;
        color: #856404;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
        font-weight: 500;
    }
    .section-card {
        background-color: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.2rem;
        margin-bottom: 1rem;
    }
    .source-badge {
        background-color: #e3f2fd;
        color: #0d47a1;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.85rem;
    }
</style>
"""
st.markdown(CUSTOM_ACCESSIBLE_CSS, unsafe_allow_html=True)

# Backend URL (Defaults to localhost:8000)
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000/api/v1")

# Header Section
st.markdown("<h1 class='main-header'>⚖️ NyayaAI — AI for Legal Access & Assistance</h1>", unsafe_allow_html=True)
st.markdown(
    "<p class='sub-header'>Understand legal rights, analyze documents safely, and find actionable next steps.</p>",
    unsafe_allow_html=True,
)

# Mandatory Legal Disclaimer Banner
st.markdown(
    "<div class='disclaimer-box' role='alert' aria-label='Legal Disclaimer'>"
    "⚠️ <strong>LEGAL INFORMATION DISCLAIMER:</strong> NyayaAI is an educational and legal information tool, "
    "<strong>NOT a licensed attorney or legal representation</strong>. NyayaAI provides legal concept guidance "
    "grounded in verified statutory sources, but cannot represent you in court. "
    "Always consult a qualified legal professional or local legal aid office for serious legal matters."
    "</div>",
    unsafe_allow_html=True,
)

# Tabs Navigation
tab1, tab2, tab3 = st.tabs(["💬 Ask Legal Question", "📄 Analyze Legal Document", "📚 Explore Demo Sources"])

# TAB 1: Ask Legal Question
with tab1:
    st.subheader("Describe Your Situation in Everyday Language")
    st.write("No legal jargon needed. Describe what happened (e.g., tenancy, employment, consumer purchase dispute).")

    col_cat, col_spacer = st.columns([1, 2])
    with col_cat:
        category_choice = st.selectbox(
            "Select Legal Category Focus (Optional):",
            options=["general", "tenants", "labor", "consumer", "privacy"],
            help="Filters relevant statutory legal sources.",
        )

    user_query = st.text_area(
        "Your Everyday Language Situation:",
        height=140,
        placeholder="Example: My landlord cut off my electricity and water supply after a dispute over deposit return. What rights do I have?",
        help="Max 4000 characters. Do NOT share sensitive personal numbers like Passports, SSNs, or Bank passwords.",
    )

    submit_btn = st.button("🔍 Get Legal Information", type="primary", use_container_width=False)

    if submit_btn:
        if not user_query.strip():
            st.error("Please enter your situation or legal question before submitting.")
        elif len(user_query) > 4000:
            st.error("Your query exceeds the maximum allowed length of 4000 characters.")
        else:
            with st.spinner("Analyzing legal concepts and retrieving grounded statutory sources..."):
                try:
                    payload = {"query": user_query.strip(), "user_category": category_choice}
                    res = httpx.post(f"{BACKEND_URL}/legal/query", json=payload, timeout=20.0)

                    if res.status_code == 200:
                        data = res.json()

                        # Display Structured Output
                        st.markdown("### 📋 1. User Facts Summary")
                        st.info(data.get("facts_summary", ""))

                        st.markdown("### 📚 2. Retrieved Grounding Sources")
                        sources = data.get("retrieved_sources", [])
                        if sources:
                            for src in sources:
                                st.markdown(
                                    f"- <span class='source-badge'>[{src['id']}]</span> **{src['act_or_law']} ({src['section']})** — *{src['title']}*\n  _{src['summary']}_",
                                    unsafe_allow_html=True,
                                )
                        else:
                            st.write("No specific statutory match; applying general legal principles.")

                        st.markdown("### 💡 3. Plain-Language Explanation")
                        st.markdown(f"<div class='section-card'>{data.get('explanation', '')}</div>", unsafe_allow_html=True)

                        st.markdown("### ⚠️ 4. Uncertainties & Required Information")
                        for unc in data.get("uncertainties", []):
                            st.markdown(f"- {unc}")

                        st.markdown("### 🚀 5. Reasonable Next Steps & Legal Assistance")
                        for step in data.get("next_steps", []):
                            st.markdown(f"1. {step}")

                    else:
                        err_detail = res.json().get("detail", "An error occurred.")
                        st.error(f"Error ({res.status_code}): {err_detail}")

                except httpx.ConnectError:
                    st.error("Could not connect to NyayaAI Backend server. Ensure `uvicorn backend.main:app` is running on port 8000.")
                except Exception as e:
                    st.error(f"An unexpected error occurred: {str(e)}")

# TAB 2: Analyze Legal Document
with tab2:
    st.subheader("Upload Legal Document for Safe Analysis")
    st.write("Supported file formats: **.txt, .pdf, .md** (Max file size: **2MB**).")

    uploaded_file = st.file_uploader(
        "Choose a legal document or contract file:",
        type=["txt", "pdf", "md"],
        help="Documents are processed securely as data context only.",
    )

    doc_query = st.text_input(
        "Optional Question About Document:",
        value="Explain key terms, rights, and potential liabilities in this document.",
    )

    analyze_doc_btn = st.button("📄 Analyze Document", type="primary")

    if analyze_doc_btn:
        if not uploaded_file:
            st.error("Please select a file to upload first.")
        else:
            with st.spinner("Safely extracting text and performing legal analysis..."):
                try:
                    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
                    data_form = {"query": doc_query, "user_category": "general"}
                    res = httpx.post(f"{BACKEND_URL}/legal/analyze-document", files=files, data=data_form, timeout=25.0)

                    if res.status_code == 200:
                        doc_res = res.json()
                        st.success(f"Successfully processed document: **{doc_res['file_name']}** ({doc_res['file_size_bytes']} bytes)")

                        st.markdown("**Extracted Text Snippet:**")
                        st.code(doc_res["extracted_text_snippet"])

                        analysis = doc_res["analysis"]
                        st.markdown("### 💡 Document Analysis & Legal Explanation")
                        st.write(analysis.get("explanation", ""))

                        st.markdown("### 🚀 Recommended Next Steps")
                        for step in analysis.get("next_steps", []):
                            st.markdown(f"- {step}")
                    else:
                        err_detail = res.json().get("detail", "Failed to analyze document.")
                        st.error(f"Error ({res.status_code}): {err_detail}")

                except httpx.ConnectError:
                    st.error("Could not connect to NyayaAI Backend server. Ensure backend is running.")
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")

# TAB 3: Explore Knowledge Base Sources
with tab3:
    st.subheader("Verified Local Knowledge Base Legal Sources")
    st.write("NyayaAI grounds legal explanations strictly against verified statutory references to prevent hallucination.")

    if st.button("🔄 Refresh Knowledge Base Sources"):
        try:
            res = httpx.get(f"{BACKEND_URL}/legal/sources", timeout=10.0)
            if res.status_code == 200:
                sources_list = res.json()
                for s in sources_list:
                    with st.expander(f"📌 [{s['id']}] {s['act_or_law']} - {s['title']}"):
                        st.write(f"**Section:** {s['section']}")
                        st.write(f"**Category:** `{s['category']}`")
                        st.write(f"**Summary:** {s['summary']}")
            else:
                st.error("Failed to load sources from backend.")
        except Exception as e:
            st.info("Start the FastAPI backend to inspect knowledge base sources dynamically.")
