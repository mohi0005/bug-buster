import React from 'react';
import { Bug, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                Bug Buster
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-3 h-3" />
                Gemma 4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multimodal Error Screenshot Diagnosis & Remediation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Screenshot &rarr; Gemma 4 &rarr; Actionable Fix</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Hack Day MVP
          </span>
        </div>
      </div>
    </header>
  );
};
