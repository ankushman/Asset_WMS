'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  User,
  Mail,
  Phone,
  Building2,
  Warehouse,
  ShieldCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Key,
  Briefcase,
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;

  const { employees, auditLogs, updateEmployeeStatus, user: currentUser } = useAuthStore();
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employee Record Not Found</h2>
        <p className="text-xs text-slate-500">The employee profile you requested could not be located in your workspace.</p>
        <Link
          href="/dashboard/employees"
          className="inline-flex items-center gap-2 text-xs font-bold text-royal-600 dark:text-royal-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Employee Directory
        </Link>
      </div>
    );
  }

  const employeeAuditLogs = auditLogs.filter(
    (log) => log.targetUser === employee.id || log.performedBy === employee.id
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Button */}
      <Link
        href="/dashboard/employees"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Employee Directory
      </Link>

      {/* Employee Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md flex-shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{employee.name}</h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {employee.employeeIdCode}
              </span>
            </div>
            <p className="text-xs font-bold text-royal-600 dark:text-royal-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {employee.designation} • {employee.department}
            </p>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-4 pt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {employee.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {employee.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {employee.accountStatus === 'ACTIVE' && (
            <button
              onClick={() => updateEmployeeStatus(employee.id, 'SUSPENDED')}
              className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-2 hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" /> Suspend Access
            </button>
          )}

          {employee.accountStatus === 'SUSPENDED' && (
            <button
              onClick={() => updateEmployeeStatus(employee.id, 'ACTIVE')}
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Reactivate Employee
            </button>
          )}
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Employment & Facility Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-royal-600 dark:text-royal-400" />
              Employment Details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Department</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.department}</p>
              </div>

              <div>
                <span className="text-slate-400">Designation</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.designation}</p>
              </div>

              <div>
                <span className="text-slate-400">RBAC System Role</span>
                <p className="font-mono font-bold text-royal-600 dark:text-royal-400 mt-0.5">{employee.role}</p>
              </div>

              <div>
                <span className="text-slate-400">Assigned Facility</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.warehouseName || 'All Multi-Hub Facilities'}</p>
              </div>

              <div>
                <span className="text-slate-400">Emergency Contact</span>
                <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{employee.emergencyContact || 'Not specified'}</p>
              </div>

              <div>
                <span className="text-slate-400">Date Joined</span>
                <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">{new Date(employee.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Employee Audit History */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Employee Governance & Activity History
            </h2>

            <div className="space-y-3 text-xs">
              {employeeAuditLogs.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">No recorded governance activity logs for this employee.</p>
              ) : (
                employeeAuditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
                    <div>
                      <span className="font-mono font-bold text-royal-600 dark:text-royal-400">{log.action}</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5">{log.details}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">By {log.performedByName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status & Access Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-royal-600 dark:text-royal-400" />
              Account Status & Security
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Account State:</span>
                <strong className="font-bold text-emerald-600 dark:text-emerald-400">{employee.accountStatus}</strong>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Last Login:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                  {employee.lastLoginAt ? new Date(employee.lastLoginAt).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
