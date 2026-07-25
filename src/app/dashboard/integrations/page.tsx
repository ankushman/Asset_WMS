'use client';

import React from 'react';
import { Plug, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { useIntegrationStore } from '@/store/useIntegrationStore';

export default function IntegrationsPage() {
  const { connectors, toggleStatus } = useIntegrationStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Plug className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Enterprise ERP & CRM Integration Framework
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configurable enterprise connectors for SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365, Salesforce CRM, and Power BI.
        </p>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">{c.category} System</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{c.systemName}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  c.status === 'CONNECTED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300 truncate">
              Endpoint: {c.apiEndpoint}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Sync Frequency: <strong className="text-slate-800 dark:text-slate-200">{c.syncFrequency}</strong></span>
              <span>Last Sync: <strong className="text-emerald-500">{c.lastSyncAt}</strong></span>
            </div>

            <button
              onClick={() => toggleStatus(c.id)}
              className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              {c.status === 'CONNECTED' ? 'Disconnect Connector' : 'Connect Enterprise API'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
