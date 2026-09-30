'use client';

import React from 'react';
import { X, Sparkles, AlertTriangle, MapPin, Building2, ShieldCheck, HelpCircle, Clock, UserCheck, CheckCircle2 } from 'lucide-react';
import { Complaint, CaseStatus } from '../lib/types';

interface CaseDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: CaseStatus) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ complaint, onClose, onUpdateStatus }) => {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-extrabold text-sky-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              {complaint.id}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              complaint.priorityLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              complaint.priorityLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              {complaint.priorityLevel} PRIORITY
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* Status Bar & Action Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Current Status</span>
              <span className={`inline-flex items-center gap-1.5 mt-1 font-bold text-sm ${
                complaint.status === 'Resolved' ? 'text-emerald-600' :
                complaint.status === 'In Progress' ? 'text-sky-600' :
                'text-amber-600'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                {complaint.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Change Status:</span>
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 shadow-xs">
                {(['Pending', 'In Progress', 'Resolved'] as CaseStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(complaint.id, st)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      complaint.status === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Category</span>
              <span className="font-bold text-slate-900">{complaint.category}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Issue</span>
              <span className="font-bold text-slate-900">{complaint.issue}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Severity Score</span>
              <span className="font-extrabold text-rose-600 text-sm">{complaint.severity} / 100</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Department</span>
              <span className="font-bold text-sky-700">{complaint.department}</span>
            </div>
          </div>

          {/* Raw Complaint Text */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Citizen Raw Input</span>
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-900 italic">
              &quot;{complaint.rawDescription}&quot;
            </div>
          </div>

          {/* AI Summary */}
          <div className="space-y-1.5 bg-sky-50/70 p-4 rounded-xl border border-sky-100">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              AI Structured Summary
            </span>
            <p className="text-slate-800 font-medium">{complaint.summary}</p>
          </div>

          {/* Recommended Action */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Recommended Field Action
            </span>
            <p className="text-slate-800 font-medium">{complaint.recommendedAction}</p>
          </div>

          {/* AI Reasoning */}
          <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-xl border border-amber-100">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              AI Prioritization Reasoning
            </span>
            <p className="text-slate-700 text-xs leading-relaxed">{complaint.reasoning}</p>
          </div>

          {/* Location & Metadata footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{complaint.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned: {complaint.assignedOfficer || 'Municipal Field Team'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Logged: {complaint.createdAt}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-lg text-xs transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
