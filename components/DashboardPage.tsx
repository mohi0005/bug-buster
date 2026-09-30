'use client';

import React, { useState } from 'react';
import { Complaint, FilterOption, CaseStatus } from '../lib/types';
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, Eye, Shield, Building2, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';
import { CaseDetailModal } from './CaseDetailModal';

interface DashboardPageProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, newStatus: CaseStatus) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ complaints, onUpdateStatus }) => {
  const [filter, setFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);

  // Dynamic KPI Stats calculations based on live state
  const totalCount = complaints.length;
  const highPriorityCount = complaints.filter(c => c.priorityLevel === 'HIGH').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;

  // Filter complaints based on tab + search query
  const filteredComplaints = complaints.filter(c => {
    // Tab filter
    if (filter === 'High Priority' && c.priorityLevel !== 'HIGH') return false;
    if (filter === 'Medium' && c.priorityLevel !== 'MEDIUM') return false;
    if (filter === 'Low' && c.priorityLevel !== 'LOW') return false;
    if (filter === 'Resolved' && c.status !== 'Resolved') return false;
    if (filter === 'Pending' && c.status !== 'Pending') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.issue.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.rawDescription.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const filterTabs: FilterOption[] = ['All', 'High Priority', 'Medium', 'Low', 'Pending', 'Resolved'];

  return (
    <div className="space-y-8 py-6 pb-16">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Municipal Service Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">CivicAI Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time automated grievance triage, severity monitoring & municipal dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block">Active Dispatch Unit</span>
            <span className="font-bold text-white">GHMC Municipal Corp</span>
          </div>
        </div>
      </div>


      {/* STATS ROW (4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Complaints */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Complaints</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Logged in system</span>
        </div>

        {/* High Priority */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">High Priority</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{highPriorityCount}</p>
          <span className="text-[11px] text-rose-600/80 mt-1 block font-medium">Severity score 80–100</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{pendingCount}</p>
          <span className="text-[11px] text-amber-600/80 mt-1 block font-medium">Awaiting field action</span>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600/80 mt-1 block font-medium">Action completed</span>
        </div>

      </div>


      {/* FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filterTabs.map((tabOption) => (
            <button
              key={tabOption}
              onClick={() => setFilter(tabOption)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tabOption
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tabOption}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, issue, location..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-xs font-medium text-slate-900"
          />
        </div>

      </div>


      {/* COMPLAINTS TABLE / CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            
            {/* Table Header */}
            <thead className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Case ID</th>
                <th className="py-4 px-4">Category & Issue</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Severity</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 text-slate-800 text-xs font-medium">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    No complaints found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedCase(c)}
                  >
                    
                    {/* ID */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-sky-600 whitespace-nowrap">
                      {c.id}
                    </td>

                    {/* Category & Issue */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{c.issue}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{c.category}</div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                      {c.location}
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        c.priorityLevel === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : c.priorityLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}>
                        {c.priorityLevel}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${
                          c.severity >= 80 ? 'text-rose-600' : c.severity >= 50 ? 'text-amber-600' : 'text-sky-600'
                        }`}>
                          {c.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-700">
                      {c.department}
                    </td>

                    {/* Status Toggle Selector */}
                    <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={(e) => onUpdateStatus(c.id, e.target.value as CaseStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : c.status === 'In Progress'
                            ? 'bg-sky-50 text-sky-700 border-sky-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* Footer Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredComplaints.length} of {totalCount} total cases</span>
          <span className="font-semibold text-slate-700">CivicAI DPI Automated Engine</span>
        </div>

      </div>


      {/* CASE DETAIL MODAL */}
      <CaseDetailModal
        complaint={selectedCase}
        onClose={() => setSelectedCase(null)}
        onUpdateStatus={onUpdateStatus}
      />

    </div>
  );
};
