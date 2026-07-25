'use client';

import React from 'react';
import { Cpu, AlertCircle, Clock, Battery, Activity, Wrench } from 'lucide-react';
import { useMheStore } from '@/store/useMheStore';

export default function AiMaintenancePage() {
  const { equipments } = useMheStore();

  const predictiveData = equipments.map((e, idx) => ({
    ...e,
    rulHours: idx === 0 ? 420 : idx === 1 ? 140 : 48,
    failureProb: idx === 0 ? '4.2%' : idx === 1 ? '24.8%' : '89.5%',
    riskLevel: idx === 2 ? 'CRITICAL' : idx === 1 ? 'MEDIUM' : 'LOW',
    aiAction: idx === 2 ? 'Schedule immediate bearing & seal replacement' : idx === 1 ? 'Battery cell balancing in next shift' : 'Routine quarterly inspection',
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-amber-500" />
          Predictive Equipment Maintenance & Remaining Useful Life (RUL)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Machine learning failure probability models, RUL degradation countdowns, and automated service recommendations.
        </p>
      </div>

      {/* Equipment Predictive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictiveData.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {item.equipmentCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.name}</h3>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                  item.riskLevel === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : item.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {item.riskLevel} RISK
              </span>
            </div>

            {/* RUL Dial */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Remaining Useful Life (RUL)</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{item.rulHours} hrs</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Failure Prob %</span>
                <p className="text-xl font-extrabold text-rose-500 font-mono">{item.failureProb}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p>Facility: <strong className="text-slate-900 dark:text-white">{item.warehouseName}</strong></p>
              <p className="text-royal-600 dark:text-royal-400 font-semibold pt-1">
                AI Recommendation: {item.aiAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
