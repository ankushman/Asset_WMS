'use client';

import React from 'react';
import { Radio, Battery, Activity, Wifi, ShieldCheck } from 'lucide-react';
import { useIotStore } from '@/store/useIotStore';

export default function IotPage() {
  const { devices } = useIotStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          IoT Sensor Telemetry Infrastructure & Device Readiness
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time telemetry streams for RFID Gates, Forklift load sensors, Cold-chain temperature monitors, and GPS Trackers.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devices.map((dev) => (
          <div
            key={dev.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-bold text-royal-600 dark:text-royal-400">{dev.deviceCode}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {dev.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{dev.deviceType.replace('_', ' ')}</h3>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">
              {dev.telemetryData}
            </div>

            <div className="text-[11px] text-slate-500 space-y-0.5">
              <p>Facility: <strong>{dev.warehouseName}</strong></p>
              <p>Battery: <span className="font-mono font-bold text-emerald-500">{dev.batteryLevel}%</span> | Ping: {dev.lastPing}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
