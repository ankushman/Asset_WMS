'use client';

import React, { useState } from 'react';
import { FileText, Search, Shield, User, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const auditLogs = [
    { id: 'log-1', user: 'Super Admin User', email: 'admin@sankajlogistics.com', ip: '192.168.1.102', timestamp: '2026-07-24 10:45:12 AM', module: 'TMS', action: 'DISPATCH_TRIP', details: 'Dispatched Delivery Trip TRP-2026-8801 to Mahindra Auto Parts', oldValue: 'SCHEDULED', newValue: 'GATE_OUT' },
    { id: 'log-2', user: 'Rajesh Sharma', email: 'rajesh.sharma@sankajlogistics.com', ip: '192.168.1.140', timestamp: '2026-07-24 09:40:05 AM', module: 'INBOUND', action: 'GRN_GENERATED', details: 'Issued GRN #9941 for 850 units from Tata International', oldValue: 'COUNTING', newValue: 'GRN' },
    { id: 'log-3', user: 'Deepak Sankaj', email: 'deepak@sankajlogistics.com', ip: '192.168.1.88', timestamp: '2026-07-24 07:20:00 AM', module: 'OUTBOUND', action: 'INVOICE_AUTHORIZED', details: 'Authorized Sales Invoice INV-SNK-9901 for 450 units', oldValue: 'PENDING', newValue: 'COMPLETED' },
    { id: 'log-4', user: 'System Admin', email: 'admin@sankajlogistics.com', ip: '127.0.0.1', timestamp: '2026-07-24 06:00:00 AM', module: 'ASSETS', action: 'ASSIGN_ASSET', details: 'Assigned Toyota Forklift AST-FORK-001 to Priya Sundaram', oldValue: 'Unassigned', newValue: 'Priya Sundaram' },
  ];

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Enterprise Security Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Immutable audit log trail recording user logins, entity updates, approvals, exports, IP addresses, and state changes.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action type, or module name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Timestamp & IP</th>
                <th className="p-4">User</th>
                <th className="p-4">Module</th>
                <th className="p-4">Action</th>
                <th className="p-4">Audit Details</th>
                <th className="p-4">State Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-[11px]">
                    <div>{log.timestamp}</div>
                    <span className="text-[10px] text-slate-400">IP: {log.ip}</span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.user}</div>
                    <div className="text-[11px] text-slate-400">{log.email}</div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-royal-50 text-royal-700 dark:bg-royal-950 dark:text-royal-300">
                      {log.module}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{log.details}</td>

                  <td className="p-4 font-mono text-[11px]">
                    <span className="text-slate-400">{log.oldValue}</span> &rarr; <span className="text-emerald-500 font-bold">{log.newValue}</span>
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
