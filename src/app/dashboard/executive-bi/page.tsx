'use client';

import React from 'react';
import { PieChart, TrendingUp, Award, AlertTriangle, ShieldCheck, BarChart3 } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';

export default function ExecutiveBiPage() {
  const { warehouses } = useWarehouseStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Executive Intelligence & Business Intelligence (BI) Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Top 10 operational issues, customer SLA performance heatmaps, top-performing facilities, and strategic growth risks.
        </p>
      </div>

      {/* Heatmap Matrix Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 5 Operational Risks Identified</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-200 flex justify-between items-center">
              <span>1. Stockout risk on Castrol 4L Engine Oil at Delhi Hub</span>
              <span className="font-mono font-bold text-rose-400">88% Probability</span>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-xl text-amber-200 flex justify-between items-center">
              <span>2. Forklift MHE-STK-09 battery degradation (18% level)</span>
              <span className="font-mono font-bold text-amber-400">Action Required</span>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-xl text-amber-200 flex justify-between items-center">
              <span>3. Same-Day Dispatch SLA breach for Reliance Industrial</span>
              <span className="font-mono font-bold text-amber-400">₹10,000 Penalty</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Facility Ranking Leaderboard</h3>
          <div className="space-y-3 text-xs">
            {warehouses.map((w, idx) => (
              <div key={w.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-royal-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{w.name}</span>
                </div>
                <span className="font-mono font-bold text-emerald-500">98.{9 - idx}% Efficiency</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
