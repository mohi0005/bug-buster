'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, MapPin, Tag, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle, ShieldCheck, Building2, HelpCircle } from 'lucide-react';
import { AIAnalysisResult, Complaint } from '../lib/types';
import { analyzeComplaint } from '../lib/ai-analyzer';

interface ReportPageProps {
  onCaseSubmitted: (newComplaint: Complaint) => void;
  onNavigateToDashboard: () => void;
}

const PRESET_DEMO_EXAMPLES = [
  {
    label: "1. Pothole near MJCET (High Risk)",
    text: "There is a huge pothole near MJCET and two accidents happened there this week.",
    location: "MJCET, Hyderabad"
  },
  {
    label: "2. Water Leakage Mehdipatnam (3 days)",
    text: "There has been a water leakage near Mehdipatnam for three days.",
    location: "Mehdipatnam, Hyderabad"
  },
  {
    label: "3. Streetlight Dark College Road",
    text: "The streetlight near the college road has not been working for several nights.",
    location: "College Road, Hyderabad"
  },
  {
    label: "4. Garbage Uncollected (4 days)",
    text: "Garbage has not been collected from our street for four days.",
    location: "Jubilee Hills, Hyderabad"
  },
  {
    label: "5. Road Damaged near Bus Stop",
    text: "The road near the bus stop is badly damaged.",
    location: "Koti Bus Stop, Hyderabad"
  }
];

export const ReportPage: React.FC<ReportPageProps> = ({ onCaseSubmitted, onNavigateToDashboard }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [caseId, setCaseId] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSubmittedSuccess(false);

    // Simulate multi-step intelligence loading for presentation
    setAnalysisStep('AI is analyzing the complaint text...');
    await new Promise(r => setTimeout(r, 400));
    setAnalysisStep('Evaluating severity level & public safety impact...');
    await new Promise(r => setTimeout(r, 400));
    setAnalysisStep('Routing case to municipal department...');

    const result = await analyzeComplaint(description, location || 'Hyderabad');
    
    // Generate clean case ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCaseId(`CA-${randomNum}`);

    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSelectPreset = (example: typeof PRESET_DEMO_EXAMPLES[0]) => {
    setDescription(example.text);
    setLocation(example.location);
  };

  const handleSubmitCase = () => {
    if (!analysisResult) return;

    const newComplaint: Complaint = {
      ...analysisResult,
      id: caseId,
      rawDescription: description,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assignedOfficer: 'Auto-Dispatched Officer'
    };

    onCaseSubmitted(newComplaint);
    setSubmittedSuccess(true);
  };

  const handleAnalyzeAnother = () => {
    setDescription('');
    setLocation('');
    setCategory('');
    setAnalysisResult(null);
    setSubmittedSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Grievance Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Report a Public Infrastructure Issue</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Describe the problem in plain natural language. CivicAI will instantly classify, assess severity, and assign routing.
          </p>
        </div>
      </div>


      {/* FORM SECTION */}
      {!analysisResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Preset Demo Prompts */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Click Demo Test Case Prompt:
              </span>
              <span className="text-[11px] text-slate-500">Preset Hyderabad examples</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_DEMO_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(ex)}
                  className="text-xs font-medium bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg transition-all shadow-xs"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-6">
            
            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Complaint Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe the problem you are experiencing..."
                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 text-sm placeholder:text-slate-400 transition-all resize-y shadow-xs"
              />
            </div>

            {/* Location & Optional Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Telangana"
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 text-sm placeholder:text-slate-400 transition-all shadow-xs"
                />
              </div>

              {/* Optional Category Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-slate-500" />
                  Optional Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 text-sm transition-all shadow-xs bg-white"
                >
                  <option value="">Auto-detect with AI (Recommended)</option>
                  <option value="Road Infrastructure">Road Infrastructure</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Public Transport">Public Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing || !description.trim()}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-3 text-base"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{analysisStep || 'AI is analyzing the complaint...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>

          </form>

        </div>
      )}


      {/* AI ANALYSIS RESULT DISPLAY CARD */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {submittedSuccess ? (
            /* Success Feedback Banner */
            <div className="bg-emerald-900 text-white rounded-2xl p-8 border border-emerald-700 shadow-xl text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-800 text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Case Successfully Logged to System</h2>
              <p className="text-emerald-200 text-sm max-w-md mx-auto">
                Case <span className="font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded">{caseId}</span> has been dispatched to {analysisResult.department} and added to the live municipal dashboard.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  onClick={onNavigateToDashboard}
                  className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                >
                  <span>View in Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAnalyzeAnother}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl border border-emerald-600 transition-all text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Analyze Another</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE RESULT CARD */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Card Top Header */}
              <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-extrabold text-sky-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    CASE #{caseId}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Structured Case
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>CivicAI Engine v2.4</span>
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 6 Grid Metric Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Category */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Category</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {analysisResult.category}
                    </span>
                  </div>

                  {/* Issue */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Issue</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {analysisResult.issue}
                    </span>
                  </div>

                  {/* Severity */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Severity Score</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xl font-extrabold text-slate-900">
                        {analysisResult.severity} <span className="text-xs font-normal text-slate-500">/ 100</span>
                      </span>
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            analysisResult.severity >= 80 ? 'bg-rose-500' : analysisResult.severity >= 50 ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${analysisResult.severity}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Priority Level</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                        analysisResult.priorityLevel === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : analysisResult.priorityLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {analysisResult.priorityLevel}
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Department</span>
                    <span className="text-base font-bold text-sky-700 mt-1 block flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-sky-600" />
                      {analysisResult.department}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Location</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {analysisResult.location}
                    </span>
                  </div>

                </div>

                {/* AI Summary */}
                <div className="space-y-2 bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    AI Summary:
                  </span>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    &quot;{analysisResult.summary}&quot;
                  </p>
                </div>

                {/* Recommended Action */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Recommended Action:
                  </span>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    &quot;{analysisResult.recommendedAction}&quot;
                  </p>
                </div>

                {/* AI Reasoning */}
                <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    AI Reasoning:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    &quot;{analysisResult.reasoning}&quot;
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleAnalyzeAnother}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Analyze Another</span>
                  </button>

                  <button
                    onClick={handleSubmitCase}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submit Case</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
