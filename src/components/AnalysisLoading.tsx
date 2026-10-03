import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export const AnalysisLoading: React.FC = () => {
  const steps = [
    'Scanning screenshot & extracting error traces...',
    'Interpreting visual logs with Gemma 4 multimodal model...',
    'Diagnosing root cause & failure mechanisms...',
    'Synthesizing step-by-step fix and immediate next action...',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full rounded-2xl border border-purple-500/30 bg-purple-950/10 backdrop-blur-sm p-6 sm:p-8 animate-fade-in shadow-xl shadow-purple-950/20">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Cpu className="w-8 h-8 animate-pulse text-purple-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-purple-500/50 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Gemma 4 is Analyzing Error</span>
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Multimodal vision processing in progress. This usually takes just a few seconds.
        </p>

        {/* Progress steps */}
        <div className="w-full space-y-2.5 text-left">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 text-xs p-2 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30 font-medium'
                    : isCompleted
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Shimmer skeleton bar */}
        <div className="w-full mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 animate-pulse w-3/4 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
