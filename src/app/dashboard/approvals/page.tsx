'use client';

import React, { useState } from 'react';
import { CheckSquare, CheckCircle2, XCircle, Clock, User, MessageSquare } from 'lucide-react';
import { useApprovalStore } from '@/store/useApprovalStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function ApprovalsPage() {
  const { requests, updateStatus } = useApprovalStore();
  const { user } = useAuthStore();
  const [commentInput, setCommentInput] = useState('');

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const historyRequests = requests.filter((r) => r.status !== 'PENDING');

  const handleDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateStatus(id, status, user?.name || 'Super Admin', commentInput || 'Action authorized');
    setCommentInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Multi-Level Approval Engine & Governance Workflow
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review and authorize Asset Purchases, Asset Disposals, Stock Transfers, Inventory Adjustments, and Maintenance Requests.
        </p>
      </div>

      {/* Pending Queue Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Pending Approvals Queue ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-4 text-center">No pending approval requests in queue.</p>
        ) : (
          <div className="space-y-4 text-xs">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                      {req.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{req.title}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Requestor: <strong className="text-slate-800 dark:text-slate-200">{req.requestorName}</strong> | Facility: {req.warehouseName} | Date: <span className="font-mono">{req.createdAt}</span>
                  </p>
                  {req.amount && (
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Value: ₹{req.amount.toLocaleString()}
                    </p>
                  )}
                  {req.comments && <p className="text-slate-500 italic text-[11px]">"{req.comments}"</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecision(req.id, 'APPROVED')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-md flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Authorize & Approve
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, 'REJECTED')}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-md flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Past Approval Audit History</h3>
        <div className="space-y-3 text-xs">
          {historyRequests.map((req) => (
            <div key={req.id} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{req.title}</span>
                <p className="text-[11px] text-slate-400">Approved by {req.approverName} on {req.decisionDate}</p>
              </div>
              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                  req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
