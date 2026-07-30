'use client';

import React, { useState } from 'react';
import { Gauge, AlertTriangle, CheckCircle2, ShieldAlert, Plus, TrendingUp, DollarSign } from 'lucide-react';
import { useKpiSlaStore } from '@/store/useKpiSlaStore';

export default function KpiSlaPage() {
  const { kpis, slas, breaches, addKpi } = useKpiSlaStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [target, setTarget] = useState(98);
  const [actual, setActual] = useState(97.5);
  const [unit, setUnit] = useState<'%' | 'Hours' | '₹' | 'Rate'>('%');

  const totalPenalties = breaches.reduce((acc, b) => acc + b.penaltyAmount, 0);

  const handleCreateKpi = (e: React.FormEvent) => {
    e.preventDefault();
    addKpi({
      name,
      description: 'Custom Configured Enterprise KPI',
      formula,
      target: Number(target),
      actual: Number(actual),
      unit,
      frequency: 'DAILY',
      warehouseName: 'Mumbai Central Mega Hub',
      department: 'Logistics',
      status: actual >= target ? 'MEETING_TARGET' : 'AT_RISK',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Gauge className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Dynamic KPI Engine & SLA Violation Monitor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configurable formulas for Inventory Accuracy, Dock to Stock SLA, GRN Time, OTD, and SLA penalty breach highlights.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Configure KPI Formula
        </button>
      </div>

      {/* SLA Breach Alert Banner */}
      {breaches.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-rose-100 text-sm">
                SLA Breach Highlight Alert ({breaches.length} Violation Detected)
              </h4>
              <span className="font-mono font-bold text-rose-300">Total Penalty Exposure: ₹{totalPenalties.toLocaleString()}</span>
            </div>
            {breaches.map((b) => (
              <p key={b.id} className="text-rose-300 mt-1">
                <strong>{b.customerName}</strong> ({b.activity}): Target SLA was <span className="font-mono">{b.targetHours}h</span> but actual execution took <span className="font-mono font-bold">{b.actualHours}h</span> at {b.warehouseName}. Penalty: ₹{b.penaltyAmount.toLocaleString()}.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const isSuccess = kpi.status === 'MEETING_TARGET';
          const isCritical = kpi.status === 'CRITICAL';
          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {kpi.department} • {kpi.frequency}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{kpi.name}</h3>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                    isSuccess
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isCritical
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {kpi.status.replace('_', ' ')}
                </span>
              </div>

              {/* Progress gauge comparison */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400">Actual Value</span>
                    <p className={`text-2xl font-extrabold ${isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {kpi.actual}{kpi.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Target SLA</span>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      {kpi.target}{kpi.unit}
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (kpi.actual / kpi.target) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-700 dark:text-slate-300 truncate">
                  Formula: {kpi.formula}
                </p>
                <p className="text-[11px]">Facility Scope: <strong className="text-slate-800 dark:text-slate-200">{kpi.warehouseName}</strong></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configure Custom Dynamic KPI
            </h3>

            <form onSubmit={handleCreateKpi} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">KPI Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Packing Accuracy"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Calculation Formula</label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="(Correct Packs / Total Packs) * 100"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actual Value</label>
                  <input
                    type="number"
                    value={actual}
                    onChange={(e) => setActual(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-royal-600 rounded-xl hover:bg-royal-700 shadow-md"
                >
                  Save Dynamic KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
