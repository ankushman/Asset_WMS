'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApprovalWorkflowStore, ApprovalRequestV2 } from '@/store/useApprovalWorkflowStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ApprovalStatusBadge, PriorityBadge, EscalationBadge } from '@/components/workflows/ApprovalStatusBadge';
import { ApprovalActionModal } from '@/components/workflows/ApprovalActionModal';
import { ListChecks, Search, Filter, ChevronDown, ArrowRight, Clock, CheckCircle2, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';

type QueueTab = 'pending' | 'my_submissions' | 'approved' | 'rejected' | 'escalated' | 'all';

export default function ApprovalQueuePage() {
  const { requests, approveRequest, rejectRequest, returnRequest } = useApprovalWorkflowStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<QueueTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject' | 'return' | 'comment'; requestId: string; requestTitle: string }>({ isOpen: false, type: 'approve', requestId: '', requestTitle: '' });

  const tabs: { id: QueueTab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, count: requests.filter(r => ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(r.status)).length },
    { id: 'my_submissions', label: 'My Submissions', icon: <ArrowRight className="w-3.5 h-3.5" />, count: requests.filter(r => r.makerUserId === user?.id).length },
    { id: 'approved', label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5" />, count: requests.filter(r => r.status === 'APPROVED').length },
    { id: 'rejected', label: 'Rejected', icon: <XCircle className="w-3.5 h-3.5" />, count: requests.filter(r => r.status === 'REJECTED').length },
    { id: 'escalated', label: 'Escalated', icon: <AlertTriangle className="w-3.5 h-3.5" />, count: requests.filter(r => r.escalationStatus !== 'NONE').length },
    { id: 'all', label: 'All Requests', icon: <ListChecks className="w-3.5 h-3.5" />, count: requests.length },
  ];

  const filterRequests = (reqs: ApprovalRequestV2[]): ApprovalRequestV2[] => {
    let filtered = reqs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.requestCode.toLowerCase().includes(q) || r.makerUserName.toLowerCase().includes(q));
    }
    if (typeFilter !== 'ALL') filtered = filtered.filter(r => r.workflowType === typeFilter);
    if (priorityFilter !== 'ALL') filtered = filtered.filter(r => r.priority === priorityFilter);
    return filtered;
  };

  const getTabRequests = (): ApprovalRequestV2[] => {
    switch (activeTab) {
      case 'pending': return filterRequests(requests.filter(r => ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(r.status)));
      case 'my_submissions': return filterRequests(requests.filter(r => r.makerUserId === user?.id));
      case 'approved': return filterRequests(requests.filter(r => r.status === 'APPROVED'));
      case 'rejected': return filterRequests(requests.filter(r => r.status === 'REJECTED'));
      case 'escalated': return filterRequests(requests.filter(r => r.escalationStatus !== 'NONE'));
      case 'all': default: return filterRequests(requests);
    }
  };

  const visibleRequests = getTabRequests();
  const workflowTypes = [...new Set(requests.map(r => r.workflowType))];

  const handleAction = (type: 'approve' | 'reject' | 'return', requestId: string, comments: string) => {
    const userId = user?.id || 'usr-001';
    const userName = user?.name || 'Super Admin';
    const userRole = user?.role || 'SUPER_ADMIN';
    if (type === 'approve') approveRequest(requestId, userId, userName, userRole, comments);
    else if (type === 'reject') rejectRequest(requestId, userId, userName, userRole, comments);
    else returnRequest(requestId, userId, userName, userRole, comments);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Approval Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review, approve, or reject pending approval requests across all modules.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, code, or requestor..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="text-[11px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Types</option>
          {workflowTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-[11px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {visibleRequests.length === 0 ? (
          <div className="p-12 text-center">
            <ListChecks className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No requests found</p>
            <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">Code</div>
              <div className="col-span-3">Request</div>
              <div className="col-span-2">Type / Module</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Level</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
            </div>

            {visibleRequests.map(req => {
              const isMaker = req.makerUserId === (user?.id || '');
              const canApprove = !isMaker && ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(req.status);

              return (
                <div key={req.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors items-center">
                  <div className="col-span-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{req.requestCode}</span>
                  </div>
                  <div className="col-span-3 min-w-0">
                    <Link href={`/dashboard/approvals/${req.id}`} className="text-xs font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate block">
                      {req.title}
                    </Link>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">By {req.makerUserName} {req.warehouseName && `· ${req.warehouseName}`}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{req.workflowType.replace(/_/g, ' ')}</span>
                    {req.amount && <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{req.amount.toLocaleString()}</p>}
                  </div>
                  <div className="col-span-1"><PriorityBadge priority={req.priority} /></div>
                  <div className="col-span-1">
                    <span className="text-[10px] font-mono text-slate-500">{req.currentLevel}/{req.totalLevels}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <ApprovalStatusBadge status={req.status} size="xs" />
                    <EscalationBadge status={req.escalationStatus} />
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    {canApprove && (
                      <>
                        <button onClick={() => setActionModal({ isOpen: true, type: 'approve', requestId: req.id, requestTitle: req.title })}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => setActionModal({ isOpen: true, type: 'reject', requestId: req.id, requestTitle: req.title })}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-500 shadow-sm flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                        <button onClick={() => setActionModal({ isOpen: true, type: 'return', requestId: req.id, requestTitle: req.title })}
                          className="px-2 py-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100">
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <Link href={`/dashboard/approvals/${req.id}`} className="p-1 text-slate-400 hover:text-orange-500">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      <ApprovalActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        actionType={actionModal.type}
        requestTitle={actionModal.requestTitle}
        makerCheckerBlocked={false}
        onSubmit={(comments) => handleAction(actionModal.type as any, actionModal.requestId, comments)}
      />
    </div>
  );
}
