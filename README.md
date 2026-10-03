# Bug Buster — Multimodal Error Diagnosis & Remediation

> **MLH Hacktoberfest Hack Day Hyderabad**  
> **Challenge:** Best Use of Gemma 4  
> **Core Workflow:** `Screenshot → Gemma 4 → Structured Analysis → Actionable Result`

---

## 📌 Overview

**Bug Buster** lets developers and engineers upload or paste a technical error screenshot (compiler output, browser console, terminal traceback, or cloud alert). Gemma 4 analyzes the screenshot multimodally and delivers:

1. **What is wrong:** Clear identification of the exact error and failure point.
2. **Why it is happening:** Deep root cause diagnosis and mechanism.
3. **How to fix it:** Step-by-step remediation guide with code/config solutions.
4. **The immediate next action:** The single most critical step or command to run right away.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Language:** TypeScript
- **AI Engine:** Gemma 4 Multimodal via Google Gemini API (credentials via env var)

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

## 🎯 Features in this MVP Foundation

- **Drag & Drop + Clipboard Paste:** Drag files or press `Ctrl+V` to paste screenshots directly from your clipboard.
- **Image Preview:** Clear visual thumbnail, file size, and remove/replace controls.
- **Analysis Workflow:** One-click "Analyze Screenshot with Gemma 4" with active loading animations and step-by-step progress.
- **Error Handling:** Built-in error alert with retry and dismiss controls.
- **Structured 4-Part Output:** Dedicated visual cards for *What is wrong*, *Why it is happening*, *How to fix it*, and a high-visibility copyable *Immediate Next Action*.
- **Quick Demo Mode:** Instant "Load sample error" button to test the UI and workflow without needing live credentials.