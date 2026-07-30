'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApprovalWorkflowStore, WorkflowNotification } from '@/store/useApprovalWorkflowStore';
import { BellRing, CheckCheck, ExternalLink, Filter, Search, Trash2 } from 'lucide-react';

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch { return dateStr; }
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  APPROVAL_REQUESTED: { label: 'Approval Needed', bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300' },
  APPROVAL_COMPLETED: { label: 'Approved', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
  APPROVAL_REJECTED: { label: 'Rejected', bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
  APPROVAL_ESCALATED: { label: 'Escalated', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  APPROVAL_COMMENT: { label: 'Comment', bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300' },
  WORKFLOW_COMPLETED: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApprovalWorkflowStore();
  const [filterType, setFilterType] = useState('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  let filtered = notifications;
  if (showUnreadOnly) filtered = filtered.filter(n => !n.isRead);
  if (filterType !== 'ALL') filtered = filtered.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            In-App Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time alerts for workflow submissions, approvals, rejections, and escalations.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Notification Types</option>
            <option value="APPROVAL_REQUESTED">Approval Needed</option>
            <option value="APPROVAL_COMPLETED">Approved</option>
            <option value="APPROVAL_REJECTED">Rejected</option>
            <option value="APPROVAL_ESCALATED">Escalated</option>
            <option value="APPROVAL_COMMENT">Comment</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          Show Unread Only ({unreadCount})
        </label>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BellRing className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No notifications found</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const typeCfg = TYPE_CONFIG[notif.type] || { label: 'Alert', bg: 'bg-slate-100', text: 'text-slate-600' };
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${!notif.isRead ? 'bg-orange-50/30 dark:bg-orange-950/10' : ''}`}
              >
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${typeCfg.bg} ${typeCfg.text} flex-shrink-0 mt-0.5`}>
                  {typeCfg.label}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{formatDate(notif.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{notif.message}</p>
                </div>
                {notif.link && (
                  <Link href={notif.link} onClick={(e) => e.stopPropagation()} className="p-2 text-slate-400 hover:text-orange-500 flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
