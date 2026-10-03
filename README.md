# Bug Buster — Multimodal Error Diagnosis & Remediation

> **MLH Hacktoberfest Hack Day Hyderabad**  
> **Challenge:** Best Use of Gemma 4  
> **Core Workflow:** `Screenshot → Gemma 4 → Structured Analysis → Actionable Result`

---

## 📌 Overview

Developers often get error screenshots but still don't know what they mean or what to do next. **Bug Buster** lets you upload or paste a screenshot of any error. Gemma 4, called through the Gemini API, reads the image directly (no OCR step required) and returns four structured outputs:

1. **What is wrong (`problem`):** Clear identification of the exact error and failure point.
2. **Why it is happening (`why`):** Deep root cause diagnosis and mechanism.
3. **How to fix it (`fix`):** Step-by-step remediation walkthrough with exact code/config solutions.
4. **The immediate next action (`next_action`):** The single most critical step or command to run right away.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Language:** TypeScript
- **AI Engine:** Gemma 4 Multimodal (`gemma-4-31b-it`, `gemma-4-26b-a4b-it`) via Google Gemini API
- **Deployment Ready:** Includes Vite client + optional Procfile

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Set your VITE_GEMINI_API_KEY in .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎯 Features

- **Drag & Drop + Clipboard Paste:** Drag files or press `Ctrl+V` to paste screenshots directly from your clipboard.
- **Any Image Format Allowed:** Accepts PNG, JPG, JPEG, WEBP, GIF, SVG, BMP.
- **Model Flexibility:** Select from Gemma 4 (`31B IT`, `26B A4B IT`) or input any custom model.
- **Add Notes / Terminal Context:** Optional context textarea to add command or traceback details.
- **Structured 4-Part Output:** Dedicated visual cards with one-click copy actions.
- **Quick Demo Presets:** 3 built-in presets (React TypeError, Python Module Error, Docker Port Conflict) for instant 2-second demos.
