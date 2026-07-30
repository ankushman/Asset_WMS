'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApprovalWorkflowStore } from '@/store/useApprovalWorkflowStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ApprovalStatusBadge, PriorityBadge, EscalationBadge } from '@/components/workflows/ApprovalStatusBadge';
import { ApprovalTimeline, ApprovalLevelStepper } from '@/components/workflows/ApprovalTimeline';
import { ApprovalActionModal } from '@/components/workflows/ApprovalActionModal';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, MessageSquare, UserCheck, Ban, Clock, Warehouse, User, FileText, DollarSign, Hash } from 'lucide-react';

export default function ApprovalRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const { getRequestById, approveRequest, rejectRequest, returnRequest, reassignRequest, cancelRequest, addComment } = useApprovalWorkflowStore();
  const { user } = useAuthStore();
  const request = getRequestById(requestId);

  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject' | 'return' | 'comment' }>({ isOpen: false, type: 'approve' });

  if (!request) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Request not found</p>
        <button onClick={() => router.push('/dashboard/approvals/queue')} className="mt-3 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100">
          ← Back to Queue
        </button>
      </div>
    );
  }

  const isMaker = request.makerUserId === (user?.id || '');
  const isPending = ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(request.status);
  const canApprove = !isMaker && isPending;
  const canCancel = isMaker && isPending;
  const userId = user?.id || 'usr-001';
  const userName = user?.name || 'Super Admin';
  const userRole = user?.role || 'SUPER_ADMIN';

  const handleAction = (type: string, comments: string) => {
    if (type === 'approve') approveRequest(requestId, userId, userName, userRole, comments);
    else if (type === 'reject') rejectRequest(requestId, userId, userName, userRole, comments);
    else if (type === 'return') returnRequest(requestId, userId, userName, userRole, comments);
    else if (type === 'comment') addComment(requestId, userId, userName, userRole, comments);
  };

  const detailFields = [
    { label: 'Request Code', value: request.requestCode, icon: <Hash className="w-3.5 h-3.5" /> },
    { label: 'Submitted By', value: request.makerUserName, icon: <User className="w-3.5 h-3.5" /> },
    { label: 'Module', value: request.module, icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Warehouse', value: request.warehouseName || 'N/A', icon: <Warehouse className="w-3.5 h-3.5" /> },
    { label: 'Amount', value: request.amount ? `₹${request.amount.toLocaleString()}` : 'N/A', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { label: 'Quantity', value: request.quantity ? `${request.quantity} units` : 'N/A', icon: <Hash className="w-3.5 h-3.5" /> },
    { label: 'Submitted At', value: request.submittedAt ? new Date(request.submittedAt).toLocaleString('en-IN') : 'N/A', icon: <Clock className="w-3.5 h-3.5" /> },
    { label: 'Completed At', value: request.completedAt ? new Date(request.completedAt).toLocaleString('en-IN') : 'In Progress', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back + Header */}
      <div>
        <button onClick={() => router.push('/dashboard/approvals/queue')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600 mb-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Queue
        </button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono font-bold text-slate-400">{request.requestCode}</span>
              <ApprovalStatusBadge status={request.status} size="sm" />
              <PriorityBadge priority={request.priority} />
              <EscalationBadge status={request.escalationStatus} />
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{request.title}</h1>
            {request.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{request.description}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {canApprove && (
              <>
                <button onClick={() => setActionModal({ isOpen: true, type: 'approve' })}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => setActionModal({ isOpen: true, type: 'reject' })}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-md flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button onClick={() => setActionModal({ isOpen: true, type: 'return' })}
                  className="px-3 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-xl hover:bg-purple-100 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> More Info
                </button>
              </>
            )}
            <button onClick={() => setActionModal({ isOpen: true, type: 'comment' })}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Comment
            </button>
            {canCancel && (
              <button onClick={() => { cancelRequest(requestId, userId, userName, 'Cancelled by maker.'); }}
                className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Maker-Checker Notice */}
        {isMaker && isPending && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700 rounded-xl text-xs text-amber-700 dark:text-amber-300">
            <strong>⚠️ Maker-Checker Policy:</strong> You created this request and cannot approve it. Another authorized approver must review and approve.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Levels */}
        <div className="lg:col-span-2 space-y-5">
          {/* Request Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Request Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {detailFields.map(field => (
                <div key={field.label}>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    <span className="text-slate-300 dark:text-slate-600">{field.icon}</span>
                    {field.label}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Level Stepper */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Approval Progress — Level {request.currentLevel} of {request.totalLevels}
            </h3>
            <ApprovalLevelStepper levels={request.levelStatuses} currentLevel={request.currentLevel} />
          </div>

          {/* Approval Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Approval Timeline</h3>
            {request.approvalHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No history entries yet.</p>
            ) : (
              <ApprovalTimeline history={request.approvalHistory} />
            )}
          </div>
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="space-y-5">
          {/* Status Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Summary</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Status</span>
                <ApprovalStatusBadge status={request.status} size="xs" />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Priority</span>
                <PriorityBadge priority={request.priority} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Workflow Type</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{request.workflowType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Current Level</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{request.currentLevel} / {request.totalLevels}</span>
              </div>
              {request.currentApproverName && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Current Approver</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{request.currentApproverName.replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Type Info */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Workflow Information</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              This request follows the <strong>{request.workflowType.replace(/_/g, ' ')}</strong> approval workflow with {request.totalLevels} level(s).
              {request.totalLevels > 1 && ' Each level must approve sequentially before the next level receives the request.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ApprovalActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        actionType={actionModal.type}
        requestTitle={request.title}
        makerCheckerBlocked={isMaker && actionModal.type === 'approve'}
        onSubmit={(comments) => handleAction(actionModal.type, comments)}
      />
    </div>
  );
}
