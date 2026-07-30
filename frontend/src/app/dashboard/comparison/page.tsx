'use client';

import React from 'react';
import { GitCompare, Warehouse, CheckCircle2, TrendingUp, Award, DollarSign } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';

export default function WarehouseComparisonPage() {
  const { warehouses } = useWarehouseStore();

  const comparisonData = warehouses.map((w, i) => ({
    ...w,
    rank: `#${i + 1}`,
    inventoryAccuracy: i === 0 ? '99.8%' : i === 1 ? '98.5%' : '99.1%',
    dockToStockHrs: i === 0 ? '2.4 hrs' : i === 1 ? '3.8 hrs' : '2.9 hrs',
    onTimeDelivery: i === 0 ? '98.2%' : i === 1 ? '91.5%' : '96.0%',
    employeeProductivity: i === 0 ? '94%' : i === 1 ? '82%' : '88%',
    costPerShipment: i === 0 ? '₹42' : i === 1 ? '₹58' : '₹49',
    slaBreachesThisMonth: i === 0 ? 0 : i === 1 ? 2 : 1,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Multi-Warehouse Performance & Facility Comparison Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Side-by-side comparative analysis of facility efficiency, inventory accuracy, labor output, rental costs, and SLA breach rankings.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Facility Rank & Code</th>
                <th className="p-4">Warehouse Name & Location</th>
                <th className="p-4">Occupancy Rate</th>
                <th className="p-4">Inventory Accuracy</th>
                <th className="p-4">Dock to Stock SLA</th>
                <th className="p-4">On-Time Dispatch</th>
                <th className="p-4">Worker Output</th>
                <th className="p-4">Cost / Shipment</th>
                <th className="p-4 text-center">SLA Breaches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {comparisonData.map((wh) => (
                <tr key={wh.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-royal-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                        {wh.rank}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{wh.code}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{wh.name}</div>
                    <div className="text-[11px] text-slate-400">{wh.city}, {wh.state}</div>
                  </td>

                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {wh.occupancy}%
                  </td>

                  <td className="p-4 font-mono font-bold">{wh.inventoryAccuracy}</td>
                  <td className="p-4 font-mono">{wh.dockToStockHrs}</td>
                  <td className="p-4 font-mono font-bold text-royal-600 dark:text-royal-400">{wh.onTimeDelivery}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{wh.employeeProductivity}</td>
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{wh.costPerShipment}</td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        wh.slaBreachesThisMonth === 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {wh.slaBreachesThisMonth} Breaches
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
