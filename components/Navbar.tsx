'use client';

import React from 'react';
import { Shield, Sparkles, FileText, LayoutDashboard, Home, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'report' | 'dashboard';
  setActiveTab: (tab: 'home' | 'report' | 'dashboard') => void;
  isLiveApi?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isLiveApi = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Emblem */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-sky-500 p-2 rounded-lg text-white shadow-lg shadow-sky-500/30 group-hover:bg-sky-400 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white font-sans">CivicAI</span>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider">
                  DPI Govt Tech
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Citizen Grievance Intelligence System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isLiveApi ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> Gemini API Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sky-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Demo Mode (Ready)
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
