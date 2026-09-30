'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LandingPage } from '../components/LandingPage';
import { ReportPage } from '../components/ReportPage';
import { DashboardPage } from '../components/DashboardPage';
import { Complaint, CaseStatus } from '../lib/types';
import { getStoredComplaints, saveComplaintsToStorage } from '../lib/store';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'dashboard'>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Hydrate initial complaints store
  useEffect(() => {
    const initial = getStoredComplaints();
    setComplaints(initial);

    // Check if Gemini API key exists in environment
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) {
      setIsLiveApi(true);
    }
  }, []);

  // Handle case submission from Report page
  const handleCaseSubmitted = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveComplaintsToStorage(updated);
  };

  // Handle status updating from Dashboard page
  const handleUpdateStatus = (id: string, newStatus: CaseStatus) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setComplaints(updated);
    saveComplaintsToStorage(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      
      {/* Sticky Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isLiveApi={isLiveApi} />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <LandingPage
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectSamplePrompt={(promptText) => {
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'report' && (
          <ReportPage
            onCaseSubmitted={handleCaseSubmitted}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">CivicAI</span>
            <span>— AI-Powered Citizen Grievance Intelligence</span>
          </div>
          <p className="text-slate-500">
            Track 1: AI for Digital Public Infrastructure & Governance Prototype
          </p>
        </div>
      </footer>

    </div>
  );
}
