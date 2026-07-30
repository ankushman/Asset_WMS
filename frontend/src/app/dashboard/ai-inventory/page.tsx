'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, Package, CheckCircle2, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AiInventoryPage() {
  const forecastData = [
    { month: 'Jul', actualStock: 2307, projectedDemand: 2100, safetyMin: 500 },
    { month: 'Aug', actualStock: 2550, projectedDemand: 2400, safetyMin: 500 },
    { month: 'Sep', actualStock: 2800, projectedDemand: 2950, safetyMin: 500 },
    { month: 'Oct', actualStock: 2400, projectedDemand: 3100, safetyMin: 500 },
    { month: 'Nov', actualStock: 3200, projectedDemand: 3400, safetyMin: 500 },
    { month: 'Dec', actualStock: 3800, projectedDemand: 3900, safetyMin: 500 },
  ];

  const inventoryClassifications = [
    { sku: 'SKU-ENG-OIL-4L', name: 'Castrol 4L Engine Oil', movement: 'FAST_MOVING', stockoutRisk: '88% High Risk', reorderQty: 450, turnover: '14.2x / yr' },
    { sku: 'SKU-FLT-SEAL-09', name: 'Hydraulic Seal Kit T-9', movement: 'SLOW_MOVING', stockoutRisk: '12% Low Risk', reorderQty: 50, turnover: '2.1x / yr' },
    { sku: 'SKU-OLD-BRK-88', name: 'Legacy Drum Brake Shoe', movement: 'DEAD_STOCK', stockoutRisk: '0% Dead Stock', reorderQty: 0, turnover: '0.0x / yr' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Predictive Inventory Analytics & Stockout Forecasting Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Predict future SKU demand curves, identify fast vs slow-moving stock, dead stock risks, and automated reorder quantities.
        </p>
      </div>

      {/* Demand Curve Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">6-Month Projected Demand vs Actual Stock Level</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="projectedDemand" stroke="#10b981" fillOpacity={1} fill="url(#colorProjected)" name="Projected Demand" />
              <Area type="monotone" dataKey="actualStock" stroke="#2563eb" fillOpacity={0} name="Actual Stock" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SKU Classification Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">SKU & Item Name</th>
                <th className="p-4">Movement Velocity</th>
                <th className="p-4">Stockout Risk</th>
                <th className="p-4">Turnover Rate</th>
                <th className="p-4 text-right">AI Suggested Reorder Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {inventoryClassifications.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.movement === 'FAST_MOVING'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.movement === 'SLOW_MOVING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.movement.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-rose-500">{item.stockoutRisk}</td>
                  <td className="p-4 font-mono">{item.turnover}</td>
                  <td className="p-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{item.reorderQty} units
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
