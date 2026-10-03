import { GoogleGenerativeAI } from '@google/generative-ai';
import { BugAnalysis } from '../types';

export const SUPPORTED_MODELS = [
  { id: 'gemma-4-31b-it', name: 'Gemma 4 (31B IT)' },
  { id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 (26B A4B IT)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fallback)' },
];

export const DEFAULT_MODEL = import.meta.env.VITE_GEMMA_MODEL || 'gemma-4-31b-it';

export async function analyzeBugScreenshot(
  base64Image: string,
  mimeType: string,
  apiKeyOverride?: string,
  modelOverride?: string,
  userContext?: string
): Promise<BugAnalysis> {
  const apiKey = (apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error(
      'Gemini API Key missing. Please set VITE_GEMINI_API_KEY in your .env.local file or enter your API key in the UI.'
    );
  }

  const selectedModel = modelOverride || DEFAULT_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);

  const contextSection = userContext?.trim()
    ? `\n\nUSER-PROVIDED CONTEXT / TERMINAL NOTES:\n"${userContext.trim()}"\n`
    : '';

  const prompt = `You are "Bug Buster", an elite AI debugging assistant built for the MLH Hacktoberfest Hack Day Hyderabad challenge "Best Use of Gemma 4".

You are inspecting an uploaded technical/error screenshot (e.g. terminal traceback, compiler error, browser console, or cloud deployment log).${contextSection}

Carefully read and analyze the screenshot visually along with any provided user context. Then return a STRICT valid JSON object (with NO other text, NO preamble, and NO conversational filler) matching this schema:

{
  "whatIsWrong": "A concise 1-2 sentence statement clearly identifying what crashed, broke, or failed.",
  "whyItIsHappening": "Clear technical explanation of the underlying root cause and trigger mechanism.",
  "howToFix": [
    "Step 1: First concrete action or code modification...",
    "Step 2: Second concrete action or verification step..."
  ],
  "immediateNextAction": "The single highest-priority command or edit to run right now (formatted concisely with exact syntax/command).",
  "errorType": "Specific category (e.g., TypeError, Module Not Found, SyntaxError, 404 API Error, CORS Failure, Out of Memory)",
  "confidence": "High"
}
`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType || 'image/png',
    },
  };

  try {
    const model = genAI.getGenerativeModel({ model: selectedModel });
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const rawText = response.text();

    return parseAnalysisResponse(rawText);
  } catch (err: any) {
    if (selectedModel !== 'gemini-1.5-flash' && err?.message?.includes('not found')) {
      console.warn(`Model ${selectedModel} not found. Attempting fallback...`);
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fallbackResult = await fallbackModel.generateContent([prompt, imagePart]);
        const fallbackResp = await fallbackResult.response;
        return parseAnalysisResponse(fallbackResp.text());
      } catch (fallbackErr: any) {
        throw new Error(`Analysis failed: ${err.message}`);
      }
    }
    throw new Error(err.message || 'Failed to analyze screenshot with model.');
  }
}

function parseAnalysisResponse(rawText: string): BugAnalysis {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      whatIsWrong: parsed.whatIsWrong || parsed.problem || 'Error detected in screenshot.',
      whyItIsHappening: parsed.whyItIsHappening || parsed.why || 'Could not isolate exact root cause.',
      howToFix: Array.isArray(parsed.howToFix)
        ? parsed.howToFix
        : Array.isArray(parsed.fix)
        ? parsed.fix
        : [parsed.howToFix || parsed.fix || 'Inspect the stack trace and dependencies.'],
      immediateNextAction: parsed.immediateNextAction || parsed.next_action || 'Check the highlighted file and line number.',
      errorType: parsed.errorType || 'Runtime Error',
      confidence: parsed.confidence || 'High',
    };
  } catch (jsonErr) {
    return {
      whatIsWrong: 'Identified issue from error screenshot.',
      whyItIsHappening: cleaned.slice(0, 300),
      howToFix: [
        'Inspect the highlighted code location in your IDE',
        'Verify required environment variables and dependencies',
        'Check recent changes around the failing module'
      ],
      immediateNextAction: 'Review the latest console log lines and restart the process.',
      errorType: 'Inspection Result',
      confidence: 'Medium',
    };
  }
}
