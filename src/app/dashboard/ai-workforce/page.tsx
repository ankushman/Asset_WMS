'use client';

import React from 'react';
import { Brain, Users, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export default function AiWorkforcePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Workforce Intelligence & Shift Optimization Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Predict future manpower requirements, eliminate overtime waste, optimize shift rosters, and identify skill gaps.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Predicted Manpower Gap</span>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">+4 Pickers Needed</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Shift Efficiency Score</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">94.5%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Overtime Reduction ROI</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹42,000 / mo</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Absenteeism Risk</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">3.2% Low</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Shift Optimization Insights</h3>
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white">Morning Shift Roster Adjustment</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Reassign 2 Packers from Evening Shift to Morning Shift at Mumbai Hub to absorb 1,200 incoming receiving units from Tata International.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
