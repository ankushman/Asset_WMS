'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock, ArrowRight, MessageSquare, AlertTriangle, RotateCcw, UserCheck } from 'lucide-react';
import { ApprovalHistoryEntry, ApprovalLevelStatus } from '@/store/useApprovalWorkflowStore';

const ACTION_ICONS: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  SUBMITTED: { icon: <ArrowRight className="w-3.5 h-3.5" />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/40' },
  APPROVED: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/40' },
  REJECTED: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/40' },
  RETURNED: { icon: <RotateCcw className="w-3.5 h-3.5" />, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/40' },
  ESCALATED: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/40' },
  REASSIGNED: { icon: <UserCheck className="w-3.5 h-3.5" />, color: 'text-sky-600 dark:text-sky-400', bgColor: 'bg-sky-100 dark:bg-sky-900/40' },
  COMMENTED: { icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' },
  CANCELLED: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch { return dateStr; }
}

export function ApprovalTimeline({ history, levels }: { history: ApprovalHistoryEntry[]; levels?: ApprovalLevelStatus[] }) {
  return (
    <div className="space-y-0">
      {history.map((entry, idx) => {
        const actionCfg = ACTION_ICONS[entry.action] || ACTION_ICONS.COMMENTED;
        const isLast = idx === history.length - 1;
        return (
          <div key={entry.id} className="flex gap-3">
            {/* Timeline Line + Icon */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${actionCfg.bgColor} ${actionCfg.color}`}>
                {actionCfg.icon}
              </div>
              {!isLast && <div className="w-px flex-1 min-h-[24px] bg-slate-200 dark:bg-slate-700" />}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 ${isLast ? '' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold ${actionCfg.color}`}>{entry.action.replace('_', ' ')}</span>
                {entry.levelOrder && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Level {entry.levelOrder}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                <strong>{entry.userName}</strong>
                <span className="text-slate-400 dark:text-slate-500 ml-1">({entry.userRole.replace(/_/g, ' ')})</span>
              </p>
              {entry.comments && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-1.5 border border-slate-100 dark:border-slate-700">
                  &ldquo;{entry.comments}&rdquo;
                </p>
              )}
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">{formatDate(entry.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ApprovalLevelStepper({ levels, currentLevel }: { levels: ApprovalLevelStatus[]; currentLevel: number }) {
  return (
    <div className="space-y-2">
      {levels.map((level) => {
        const isActive = level.levelOrder === currentLevel && level.status === 'PENDING_APPROVAL';
        const isCompleted = level.status === 'APPROVED';
        const isRejected = level.status === 'REJECTED';

        return (
          <div
            key={level.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isActive ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-600 animate-orange-pulse' :
              isCompleted ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700' :
              isRejected ? 'border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-700' :
              'border-slate-200 bg-slate-50 dark:bg-slate-800/30 dark:border-slate-700'
            }`}
          >
            {/* Level Number */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isCompleted ? 'bg-emerald-500 text-white' :
              isRejected ? 'bg-rose-500 text-white' :
              isActive ? 'bg-orange-500 text-white' :
              'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isRejected ? <XCircle className="w-4 h-4" /> : level.levelOrder}
            </div>

            {/* Level Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{level.levelName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Role: {level.approverRole.replace(/_/g, ' ')}
                {level.approverName && <> · {level.approverName}</>}
              </p>
              {level.comments && <p className="text-[10px] text-slate-500 italic mt-0.5">&ldquo;{level.comments}&rdquo;</p>}
            </div>

            {/* Status */}
            <div className="text-right flex-shrink-0">
              <span className={`text-[10px] font-bold ${
                isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                isRejected ? 'text-rose-600 dark:text-rose-400' :
                isActive ? 'text-orange-600 dark:text-orange-400' :
                'text-slate-400'
              }`}>
                {isCompleted ? 'Approved' : isRejected ? 'Rejected' : isActive ? 'Awaiting' : 'Pending'}
              </span>
              {level.decidedAt && <p className="text-[9px] text-slate-400 font-mono">{formatDate(level.decidedAt)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
