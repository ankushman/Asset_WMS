'use client';

import React from 'react';
import { Navigation, Compass, AlertTriangle, Clock, MapPin, Truck } from 'lucide-react';
import { useTmsStore } from '@/store/useTmsStore';

export default function AiTransportPage() {
  const { trips } = useTmsStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Navigation className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Transportation Intelligence & Route Optimization
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Predict delivery delays, traffic impact on highways, vendor performance ratings, and fuel consumption analytics.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Delivery Delay Risk</h3>
          <div className="space-y-3 text-xs">
            {trips.map((t) => (
              <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{t.tripNumber} ({t.customerName})</span>
                  <p className="text-[11px] text-slate-400">Destination: {t.destination}</p>
                </div>
                <span className="font-mono font-bold text-emerald-500">{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Route Optimization</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Rerouting Trip TRP-8802 via NH-48 bypass saves <strong className="text-emerald-500">42 km</strong> and reduces fuel spend by ₹1,450.
          </p>
        </div>
      </div>
    </div>
  );
}
