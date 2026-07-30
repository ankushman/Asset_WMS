'use client';

import React from 'react';
import {
  Warehouse,
  Box,
  Package,
  Truck,
  Send,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import Link from 'next/link';

export default function DashboardOverviewPage() {
  const { warehouses } = useWarehouseStore();
  const { assets } = useAssetStore();
  const { items } = useInventoryStore();
  const { inboundShipments, outboundOrders } = useWorkflowStore();

  const totalInventoryQty = items.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;

  const stockTrendData = [
    { month: 'Jan', stock: 12400, capacity: 20000 },
    { month: 'Feb', stock: 14200, capacity: 20000 },
    { month: 'Mar', stock: 16800, capacity: 20000 },
    { month: 'Apr', stock: 15100, capacity: 20000 },
    { month: 'May', stock: 18900, capacity: 20000 },
    { month: 'Jun', stock: 21400, capacity: 25000 },
  ];

  const occupancyData = warehouses.map((w) => ({
    name: w.code,
    occupancy: w.occupancy,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#1F2937] p-6 rounded-lg text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-600 text-white tracking-wider">
              Industrial Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">v3.2 Live Sync</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Operational Control Center</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time visibility into multi-warehouse capacity, asset assignments, receiving GRNs, and dispatch orders.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/warehouses"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Warehouse
          </Link>
          <Link
            href="/dashboard/assets"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Asset
          </Link>
          <Link
            href="/dashboard/inventory"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add SKU
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="industrial-card p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Warehouses
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{warehouses.length}</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Active Facilities
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
            Avg Occupancy: <strong className="text-slate-800 dark:text-slate-200">71.5%</strong>
          </div>
        </div>

        {/* Card 2 */}
        <div className="industrial-card p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tracked Assets
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{assets.length}</div>
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> QR / Barcode Ready
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
            Forklifts, Scanners, Printers
          </div>
        </div>

        {/* Card 3 */}
        <div className="industrial-card p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Inventory Volume
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalInventoryQty.toLocaleString()}</div>
            {lowStockCount > 0 ? (
              <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold mt-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} SKUs Low Stock
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Stock Levels Healthy
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
            Across Rack, Shelf, Bin Locations
          </div>
        </div>

        {/* Card 4 */}
        <div className="industrial-card p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Logistics
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{inboundShipments.length}</div>
              <span className="text-xs text-slate-500">Inbound</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{outboundOrders.length}</div>
              <span className="text-xs text-slate-500">Outbound</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <Clock className="w-3.5 h-3.5" /> Real-time Pipeline Active
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
            Receiving & Dispatch Status
          </div>
        </div>
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Trend Chart */}
        <div className="lg:col-span-2 industrial-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Inventory Stock & Capacity Utilization Trend
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly aggregate stock units compared against total facility limits.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono">
              2026 Live Sync
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockTrendData}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="stock" stroke="#f97316" fillOpacity={1} fill="url(#colorStock)" name="Stock Units" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Occupancy Bar */}
        <div className="industrial-card p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              Facility Occupancy %
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Current occupancy % by warehouse
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="occupancy" fill="#1F2937" radius={[0, 4, 4, 0]} name="Occupancy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
