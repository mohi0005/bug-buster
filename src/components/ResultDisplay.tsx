import React, { useState } from 'react';
import { 
  AlertCircle, 
  HelpCircle, 
  Wrench, 
  Zap, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { BugAnalysis } from '../types';

interface ResultDisplayProps {
  analysis: BugAnalysis;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  analysis,
  onReset,
}) => {
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAction = () => {
    navigator.clipboard.writeText(analysis.immediateNextAction);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2000);
  };

  const handleCopyAll = () => {
    const formatted = `[BUG BUSTER ANALYSIS - GEMMA 4]

1. WHAT IS WRONG:
${analysis.whatIsWrong}

2. WHY IT IS HAPPENING:
${analysis.whyItIsHappening}

3. HOW TO FIX IT:
${analysis.howToFix.map((step, i) => `${i + 1}. ${step}`).join('\n')}

4. IMMEDIATE NEXT ACTION:
${analysis.immediateNextAction}
`;
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Action bar above results */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Gemma 4 Multimodal Diagnostic Report
            </h3>
            {analysis.errorType && (
              <span className="text-[11px] text-slate-400 font-mono">
                Category: {analysis.errorType}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Full Report</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Diagnose Another</span>
          </button>
        </div>
      </div>

      {/* Immediate Next Action Highlighted Card (Section 4 placed right at top for instant actionability or at bottom, let's highlight prominently) */}
      <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-5 sm:p-6 shadow-lg shadow-amber-950/20 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                4. Immediate Next Action
              </span>
              <span className="text-xs text-amber-200/70 hidden sm:inline">
                Do this first
              </span>
            </div>

            <div className="text-sm sm:text-base font-mono font-medium text-amber-100 bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 break-all select-all flex items-center justify-between gap-3">
              <span className="text-slate-100">{analysis.immediateNextAction}</span>
              <button
                type="button"
                onClick={handleCopyAction}
                className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors flex-shrink-0"
                title="Copy action command"
              >
                {copiedAction ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for 1. What is Wrong & 2. Why it is happening */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 1: What is wrong */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              1. What Is Wrong
            </h4>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {analysis.whatIsWrong}
          </p>
        </div>

        {/* Section 2: Why it is happening */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              2. Why It Is Happening
            </h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.whyItIsHappening}
          </p>
        </div>
      </div>

      {/* Section 3: How to fix it */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wrench className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. How To Fix It (Step-by-Step)
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            {analysis.howToFix.length} remediation step{analysis.howToFix.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-3">
          {analysis.howToFix.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center border border-emerald-500/20 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
