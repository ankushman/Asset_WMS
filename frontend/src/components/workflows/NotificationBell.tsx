'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { useApprovalWorkflowStore, WorkflowNotification } from '@/store/useApprovalWorkflowStore';
import Link from 'next/link';

function formatTimeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch { return ''; }
}

const TYPE_COLORS: Record<string, string> = {
  APPROVAL_REQUESTED: 'bg-blue-500',
  APPROVAL_COMPLETED: 'bg-emerald-500',
  APPROVAL_REJECTED: 'bg-rose-500',
  APPROVAL_ESCALATED: 'bg-amber-500',
  APPROVAL_COMMENT: 'bg-purple-500',
  WORKFLOW_COMPLETED: 'bg-emerald-500',
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApprovalWorkflowStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[9px] font-extrabold text-white bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 rounded-full">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead()}
                className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No notifications yet.</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''}`}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${TYPE_COLORS[notif.type] || 'bg-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{notif.message}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1">{formatTimeAgo(notif.createdAt)}</p>
                    </div>
                    {notif.link && (
                      <Link href={notif.link} onClick={(e) => e.stopPropagation()} className="p-1 text-slate-400 hover:text-orange-500 flex-shrink-0">
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            href="/dashboard/approvals/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center text-[11px] font-bold text-orange-600 dark:text-orange-400 py-2.5 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            View All Notifications →
          </Link>
        </div>
      )}
    </div>
  );
}
