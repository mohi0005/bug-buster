'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, AlertTriangle, MapPin, CheckCircle, Clock } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: 'home' | 'report' | 'dashboard') => void;
  onSelectSamplePrompt: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectSamplePrompt }) => {
  return (
    <div className="space-y-16 py-8 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 border border-slate-700/60 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Digital Public Infrastructure & Governance AI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Turn Citizen Complaints Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Actionable Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            AI-powered classification, prioritization and routing of public infrastructure complaints.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('report')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-7 py-3.5 rounded-xl border border-slate-600 transition-all text-base"
            >
              <span>View Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800 text-left max-w-3xl mx-auto mt-8">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <p className="text-xs text-slate-400 font-medium">Processing Time</p>
              <p className="text-lg font-bold text-sky-400">&lt; 1.5s</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <p className="text-xs text-slate-400 font-medium">Structured Parsing</p>
              <p className="text-lg font-bold text-sky-400">100% JSON</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <p className="text-xs text-slate-400 font-medium">Severity Matrix</p>
              <p className="text-lg font-bold text-amber-400">0 - 100 Score</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <p className="text-xs text-slate-400 font-medium">Dept Routing</p>
              <p className="text-lg font-bold text-emerald-400">Automated</p>
            </div>
          </div>

        </div>
      </section>


      {/* 3 FEATURE CARDS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How CivicAI Transforms Grievance Redressal
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Eliminating municipal backlogs with instant structured case synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Classification */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Classification</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Converts raw, unstructured citizen complaints in any language or phrasing into clean standardized civic categories like Road Infrastructure, Water, or Electricity.
            </p>
            <div className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full inline-block">
              Category & Issue Extraction
            </div>
          </div>

          {/* Card 2: Smart Prioritization */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Prioritization</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Calculates dynamic severity scores (0–100) based on public safety impact, accident reports, and time elapsed to immediately highlight HIGH priority emergencies.
            </p>
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
              0-100 Severity Matrix
            </div>
          </div>

          {/* Card 3: Department Routing */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Department Routing</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Directly routes structured case files to responsible municipal departments and field officers with AI-generated recommended actions for fast dispatch.
            </p>
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Zero Manual Triage Delay
            </div>
          </div>

        </div>
      </section>


      {/* INTERACTIVE DEMO PREVIEW SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> Live Demonstration Example
            </div>
            <h3 className="text-2xl font-bold">See CivicAI In Action</h3>
            <p className="text-slate-400 text-sm mt-1">Try one of the realistic Hyderabad civic complaint scenarios below:</p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Open Complaint Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Example Pipeline Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          
          {/* Left: Input */}
          <div className="lg:col-span-5 bg-slate-800/60 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Unstructured Input</span>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-200 text-sm leading-relaxed font-mono">
              &quot;There is a huge pothole near MJCET and two accidents happened here this week.&quot;
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Location: MJCET, Hyderabad</span>
            </div>
          </div>

          {/* Middle: Arrow */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="bg-sky-500/20 text-sky-400 p-3 rounded-full border border-sky-500/30 animate-pulse">
              <ArrowRight className="w-6 h-6 hidden lg:block" />
              <ArrowRight className="w-6 h-6 rotate-90 lg:hidden" />
            </div>
          </div>

          {/* Right: Output */}
          <div className="lg:col-span-6 bg-slate-800/60 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <span className="text-xs font-semibold uppercase text-sky-400 tracking-wider">AI Structured Case Output</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Category</span>
                <span className="font-semibold text-white">Road Infrastructure</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Issue</span>
                <span className="font-semibold text-white">Pothole</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Severity</span>
                <span className="font-bold text-rose-400">92 / 100</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Priority</span>
                <span className="font-bold text-rose-400">HIGH</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
              <span className="text-slate-400 block">Department</span>
              <span className="font-semibold text-sky-300">Roads & Infrastructure</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
