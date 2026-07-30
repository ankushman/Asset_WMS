'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, MessageSquare, X } from 'lucide-react';

type ActionType = 'approve' | 'reject' | 'return' | 'comment';

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  requestTitle: string;
  onSubmit: (comments: string) => void;
  makerCheckerBlocked?: boolean;
}

const ACTION_CONFIG: Record<ActionType, { label: string; icon: React.ReactNode; buttonBg: string; description: string }> = {
  approve: { label: 'Approve Request', icon: <CheckCircle2 className="w-5 h-5" />, buttonBg: 'bg-emerald-600 hover:bg-emerald-500', description: 'This request will advance to the next approval level or be fully approved.' },
  reject: { label: 'Reject Request', icon: <XCircle className="w-5 h-5" />, buttonBg: 'bg-rose-600 hover:bg-rose-500', description: 'This request will be rejected and the maker will be notified.' },
  return: { label: 'Request More Info', icon: <RotateCcw className="w-5 h-5" />, buttonBg: 'bg-purple-600 hover:bg-purple-500', description: 'The request will be sent back to the maker for additional information.' },
  comment: { label: 'Add Comment', icon: <MessageSquare className="w-5 h-5" />, buttonBg: 'bg-slate-600 hover:bg-slate-500', description: 'Add a comment to the approval history for this request.' },
};

export function ApprovalActionModal({ isOpen, onClose, actionType, requestTitle, onSubmit, makerCheckerBlocked }: ApprovalActionModalProps) {
  const [comments, setComments] = useState('');
  const config = ACTION_CONFIG[actionType];

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comments);
    setComments('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className={actionType === 'approve' ? 'text-emerald-600' : actionType === 'reject' ? 'text-rose-600' : actionType === 'return' ? 'text-purple-600' : 'text-slate-600'}>
              {config.icon}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{config.label}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {makerCheckerBlocked && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              <strong>⚠️ Maker-Checker Policy:</strong> You cannot approve your own request. Please assign a different approver.
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Request:</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{requestTitle}</p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">{config.description}</p>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Comments {actionType === 'reject' || actionType === 'return' ? '(Required)' : '(Optional)'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={actionType === 'approve' ? 'Add approval notes...' : actionType === 'reject' ? 'Reason for rejection...' : actionType === 'return' ? 'What information is needed...' : 'Enter your comment...'}
              className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={makerCheckerBlocked || ((actionType === 'reject' || actionType === 'return') && !comments.trim())}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5 ${config.buttonBg} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {config.icon}
            {config.label}
          </button>
        </div>
      </div>
    </div>
  );
}
