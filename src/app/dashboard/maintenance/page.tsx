'use client';

import React from 'react';
import { Hammer, Wrench, Clock, CheckCircle2, DollarSign, User } from 'lucide-react';
import { useMheStore } from '@/store/useMheStore';

export default function MaintenancePage() {
  const { maintenances, equipments } = useMheStore();

  const totalCost = maintenances.reduce((acc, m) => acc + m.cost, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Hammer className="w-6 h-6 text-amber-500" />
          Preventive & Corrective Maintenance Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Schedule equipment service overhauls, track technician repairs, parts used, downtime hours, and service costs.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Maintenance Jobs</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{maintenances.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Service Cost</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Service Vendor</span>
          <p className="text-2xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">Konecranes Support</p>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Equipment Code</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Technician / Vendor</th>
                <th className="p-4">Parts Used</th>
                <th className="p-4">Service Cost</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {maintenances.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{m.equipmentCode}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {m.serviceType}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{m.technician}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{m.partsUsed}</td>
                  <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{m.cost.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
