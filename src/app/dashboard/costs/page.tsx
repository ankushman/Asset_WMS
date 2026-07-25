'use client';

import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

export default function CostsPage() {
  const costBreakdownData = [
    { name: 'Labor & Manpower', cost: 420000 },
    { name: 'Facility Rental', cost: 450000 },
    { name: 'Transportation Freight', cost: 380000 },
    { name: 'MHE Maintenance', cost: 125000 },
    { name: 'Inventory Holding', cost: 190000 },
  ];

  const costPerActivity = [
    { activity: 'Inbound GRN Receiving', costPerUnit: '₹34 / Pallet' },
    { activity: 'Put-Away Binning', costPerUnit: '₹12 / Case' },
    { activity: 'Order Picking', costPerUnit: '₹18 / Line' },
    { activity: 'Packing & Shrink Wrap', costPerUnit: '₹15 / Box' },
    { activity: 'Outbound Gate Pass Dispatch', costPerUnit: '₹45 / Shipment' },
  ];

  const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];

  const totalMonthlyCost = costBreakdownData.reduce((acc, c) => acc + c.cost, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Operational Cost Analytics & Activity-Based Costing (ABC)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track labor costs, rental overheads, equipment maintenance, transportation freight, and cost-per-activity variance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Monthly Operational Spend</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹{totalMonthlyCost.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Cost Per Outbound Shipment</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹45 / Order</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Labor Spend Variance</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">-3.4% under budget</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Freight Cost / Km</span>
          <p className="text-2xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">₹28.5 / km</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Category Breakdown Pie */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Monthly Operational Cost Breakdown</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={costBreakdownData} dataKey="cost" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost per Activity Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activity-Based Costing (ABC) Rates</h3>
          <div className="space-y-3 text-xs">
            {costPerActivity.map((a, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-slate-900 dark:text-white">{a.activity}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  {a.costPerUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
