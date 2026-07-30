'use client';

import React, { useState } from 'react';
import { Wrench, Plus, Search, Battery, Activity, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useMheStore } from '@/store/useMheStore';

export default function EquipmentPage() {
  const { equipments, maintenances } = useMheStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipments = equipments.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            Material Handling Equipment (MHE) Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor forklifts, reach trucks, stackers, battery charge levels, health status, and maintenance service schedules.
          </p>
        </div>
      </div>

      {/* MHE Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total MHE Units</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{equipments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avg Battery Level</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">
            {Math.round(equipments.reduce((acc, e) => acc + e.batteryStatus, 0) / equipments.length)}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Maintenance Due</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {equipments.filter((e) => e.healthStatus === 'MAINTENANCE_DUE' || e.healthStatus === 'DOWN').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Logged Fleet Downtime</span>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">
            {equipments.reduce((acc, e) => acc + e.downtimeHours, 0)} hrs
          </p>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEquipments.map((eq) => (
          <div
            key={eq.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {eq.equipmentCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{eq.name}</h3>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                  eq.healthStatus === 'EXCELLENT'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : eq.healthStatus === 'MAINTENANCE_DUE'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {eq.healthStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Battery status bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" /> Battery Charge
                </span>
                <span>{eq.batteryStatus}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    eq.batteryStatus > 50 ? 'bg-emerald-500' : eq.batteryStatus > 20 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${eq.batteryStatus}%` }}
                />
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1">
              <p>Warehouse: <strong className="text-slate-900 dark:text-white">{eq.warehouseName}</strong></p>
              <p>Hours Used: <span className="font-mono">{eq.hoursUsed} hrs</span> | Downtime: <span className="font-mono text-rose-500">{eq.downtimeHours} hrs</span></p>
              <p>Operator: <strong>{eq.operatorName || 'Unassigned'}</strong></p>
              <p className="text-[11px] text-slate-400 pt-1">
                Next Service Due: <span className="font-mono text-emerald-500 font-bold">{eq.nextService}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
