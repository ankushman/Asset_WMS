'use client';

import React from 'react';
import { ApprovalRequestStatus, EscalationStatus, ApprovalPriority } from '@/store/useApprovalWorkflowStore';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  DRAFT: { label: 'Draft', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
  SUBMITTED: { label: 'Submitted', bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  PENDING_APPROVAL: { label: 'Pending Approval', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  UNDER_REVIEW: { label: 'Under Review', bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  APPROVED: { label: 'Approved', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  PARTIALLY_APPROVED: { label: 'Partially Approved', bg: 'bg-sky-100 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  LOW: { label: 'Low', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300' },
  HIGH: { label: 'High', bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300' },
  CRITICAL: { label: 'Critical', bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
};

const ESCALATION_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  NONE: { label: '', bg: '', text: '' },
  WARNING_SENT: { label: 'Warning', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  ESCALATED: { label: 'Escalated', bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300' },
  CRITICAL: { label: 'Critical', bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
};

export function ApprovalStatusBadge({ status, size = 'sm' }: { status: ApprovalRequestStatus | string; size?: 'xs' | 'sm' | 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  const sizeClasses = size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${cfg.bg} ${cfg.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ApprovalPriority | string }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

export function EscalationBadge({ status }: { status: EscalationStatus | string }) {
  if (status === 'NONE') return null;
  const cfg = ESCALATION_CONFIG[status] || ESCALATION_CONFIG.NONE;
  return (
    <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text} animate-pulse`}>
      ⚡ {cfg.label}
    </span>
  );
}
