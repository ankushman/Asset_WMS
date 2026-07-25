'use client';

import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Key, Users } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Enterprise Security Audit & Failed Login Policy Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor API rate limits, active JWT user sessions, failed login attempt thresholds, and field-level encryption policies.
        </p>
      </div>

      {/* Security Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">REST API Rate Limit</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">120 req / min</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Failed Logins (24h)</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">0 Attempts</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Session Timeout</span>
          <p className="text-2xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">30 Minutes</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Encryption Protocol</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">AES-256 GCM</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Encrypted Field Policies</h3>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">
          Encrypted Data Columns: passwordHash, resetToken, gstNumber, phone, jwtSignature
        </div>
      </div>
    </div>
  );
}
