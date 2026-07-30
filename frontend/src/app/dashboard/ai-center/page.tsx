'use client';

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Zap, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAiStore } from '@/store/useAiStore';
import Link from 'next/link';

export default function AiCenterPage() {
  const { healthScore, recommendations } = useAiStore();

  const totalPotentialSavings = recommendations.reduce((acc, r) => acc + (r.costSavings || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-royal-950 p-6 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-royal-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-royal-500/20 text-royal-300 border border-royal-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-royal-400 animate-pulse" /> AI Intelligence Core Active
              </span>
              <span className="text-xs text-slate-400">Phase 3 Live Platform</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">AI Command Center & Predictive Intelligence</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Autonomous cross-facility health scoring, proactive demand forecasting, equipment failure prediction, and ROI cost optimizations.
            </p>
          </div>

          {/* Health Score Dial */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-emerald-500/20">
              {healthScore}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enterprise Health Score</span>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4" /> Optimal Operations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/dashboard/ai-assistant"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-royal-500 transition-all group"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">Conversational Engine</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-royal-500 transition-colors flex items-center justify-between">
            AI Assistant <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </h3>
        </Link>

        <Link
          href="/dashboard/ai-inventory"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 transition-all group"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">Demand & Stockout</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-500 transition-colors flex items-center justify-between">
            Inventory Forecast <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </h3>
        </Link>

        <Link
          href="/dashboard/ai-maintenance"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-500 transition-all group"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">Equipment RUL</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-500 transition-colors flex items-center justify-between">
            Predictive MHE <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </h3>
        </Link>

        <Link
          href="/dashboard/automation"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all group"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">No-Code Rules</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-500 transition-colors flex items-center justify-between">
            Workflow Engine <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </h3>
        </Link>
      </div>

      {/* AI Recommendations Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-royal-500" /> Active AI Autonomous Recommendations ({recommendations.length})
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
            Estimated Savings: ₹{totalPotentialSavings.toLocaleString()}
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      rec.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : rec.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300'
                    }`}
                  >
                    {rec.category} • {rec.priority}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rec.title}</h4>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Reasoning:</strong> {rec.reason}
                </p>

                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Expected Impact: {rec.expectedImpact}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="font-mono text-xs font-bold text-royal-600 dark:text-royal-400">
                  Confidence: {rec.confidenceScore}%
                </span>
                {rec.costSavings && (
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Savings: ₹{rec.costSavings.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
