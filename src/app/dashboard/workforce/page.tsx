'use client';

import React, { useState } from 'react';
import { UserCheck, Clock, Calendar, TrendingUp, CheckCircle2, XCircle, Plus, AlertCircle } from 'lucide-react';
import { useWorkforceStore } from '@/store/useWorkforceStore';

export default function WorkforcePage() {
  const { shifts, attendances, leaveRequests, updateLeaveStatus } = useWorkforceStore();
  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'SHIFTS' | 'LEAVES'>('ATTENDANCE');

  const totalOvertime = attendances.reduce((acc, a) => acc + a.overtimeHrs, 0);
  const avgProductivity = attendances.length
    ? Math.round(attendances.reduce((acc, a) => acc + a.supervisoryScore, 0) / attendances.length)
    : 90;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Manpower & Workforce Productivity Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor shift rosters, attendance check-ins, overtime hours, and compare direct vs supervisory output scores.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Checked-In Staff</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{attendances.length} Active</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avg Workforce Productivity Score</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{avgProductivity}%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Logged Overtime Hours</span>
          <p className="text-2xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">{totalOvertime} hrs</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Leave Requests</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{leaveRequests.filter(l => l.status === 'PENDING').length}</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`pb-3 transition-all ${activeTab === 'ATTENDANCE' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Daily Roster & Productivity ({attendances.length})
        </button>
        <button
          onClick={() => setActiveTab('SHIFTS')}
          className={`pb-3 transition-all ${activeTab === 'SHIFTS' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Shift Calendars ({shifts.length})
        </button>
        <button
          onClick={() => setActiveTab('LEAVES')}
          className={`pb-3 transition-all ${activeTab === 'LEAVES' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Leave Management ({leaveRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Staff Member & Role</th>
                  <th className="p-4">Shift</th>
                  <th className="p-4">Check-In / Out</th>
                  <th className="p-4">Direct Output (Picked/Packed)</th>
                  <th className="p-4">Supervisory Score</th>
                  <th className="p-4">Overtime</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {att.userName}
                      <span className="block text-[10px] font-mono text-slate-400 font-normal">{att.role}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{att.shiftName}</td>
                    <td className="p-4 font-mono text-[11px]">
                      {att.checkIn} - {att.checkOut || 'In Progress'}
                    </td>
                    <td className="p-4">
                      {att.directQty > 0 ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{att.directQty} units</span>
                      ) : (
                        <span className="text-slate-400 italic">Supervisory Role</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {att.supervisoryScore}% Target
                      </span>
                    </td>
                    <td className="p-4 font-mono text-royal-600 dark:text-royal-400 font-bold">
                      {att.overtimeHrs > 0 ? `+${att.overtimeHrs} hrs` : '0 hrs'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'SHIFTS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shifts.map((sh) => (
            <div key={sh.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{sh.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-4 h-4 text-emerald-500" /> {sh.startTime} - {sh.endTime}
              </p>
              <span className="inline-block mt-4 text-[10px] font-bold px-2 py-1 bg-emerald-950 text-emerald-400 rounded">
                Active 8-Hour Operational Window
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'LEAVES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Requests Approval Queue</h3>
          <div className="space-y-3 text-xs">
            {leaveRequests.map((lev) => (
              <div key={lev.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{lev.userName} ({lev.leaveType})</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Dates: <span className="font-mono">{lev.startDate} to {lev.endDate}</span> | Reason: "{lev.reason}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {lev.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateLeaveStatus(lev.id, 'APPROVED')}
                        className="px-3 py-1.5 font-bold text-white bg-emerald-600 rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(lev.id, 'REJECTED')}
                        className="px-3 py-1.5 font-bold text-white bg-rose-600 rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-2 py-1 font-bold rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {lev.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
