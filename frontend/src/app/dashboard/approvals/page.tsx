'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, Clock, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Settings2, ListChecks, GitBranchPlus, BellRing, ArrowRight } from 'lucide-react';
import { useApprovalWorkflowStore } from '@/store/useApprovalWorkflowStore';
import { ApprovalStatusBadge, PriorityBadge, EscalationBadge } from '@/components/workflows/ApprovalStatusBadge';

export default function ApprovalsPage() {
  const { requests, stats, workflowDefinitions, businessRules, notifications } = useApprovalWorkflowStore();
  const pendingRequests = requests.filter(r => ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(r.status));
  const recentRequests = requests.slice(0, 6);
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const kpiCards = [
    { label: 'Pending Approvals', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-700' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-700' },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-700' },
    { label: 'Escalated', value: stats.escalated, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-700' },
    { label: 'Total Requests', value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-700' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <CheckSquare className="w-5 h-5" />, color: 'text-royal-600 dark:text-royal-400', bg: 'bg-royal-50 dark:bg-royal-950/30', border: 'border-royal-200 dark:border-royal-700' },
  ];

  const quickActions = [
    { label: 'Approval Queue', description: `${pendingRequests.length} pending requests`, href: '/dashboard/approvals/queue', icon: <ListChecks className="w-5 h-5" />, color: 'text-amber-600 dark:text-amber-400', badge: pendingRequests.length > 0 ? `${pendingRequests.length}` : undefined },
    { label: 'Workflow Config', description: `${workflowDefinitions.length} active workflows`, href: '/dashboard/approvals/workflow-config', icon: <Settings2 className="w-5 h-5" />, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Business Rules', description: `${businessRules.length} rules configured`, href: '/dashboard/approvals/rules', icon: <GitBranchPlus className="w-5 h-5" />, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Notification Center', description: `${unreadNotifs} unread`, href: '/dashboard/approvals/notifications', icon: <BellRing className="w-5 h-5" />, color: 'text-rose-600 dark:text-rose-400', badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Multi-Level Approval Engine & Governance Workflow
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enterprise approval workflow management with configurable business rules, multi-level approvals, maker-checker principle, and escalation engine.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`${kpi.bg} border ${kpi.border} rounded-2xl p-4 space-y-2`}>
            <div className={`${kpi.color}`}>{kpi.icon}</div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-lg transition-all flex items-start gap-3"
          >
            <div className={`${action.color} mt-0.5`}>{action.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{action.label}</h3>
                {action.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 rounded-full">{action.badge}</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-orange-500 transition-colors mt-1" />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Approval Requests</h3>
          <Link href="/dashboard/approvals/queue" className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700">View All →</Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No approval requests yet.</p>
            </div>
          ) : (
            recentRequests.map((req) => (
              <Link key={req.id} href={`/dashboard/approvals/${req.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono font-bold text-slate-400">{req.requestCode}</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{req.workflowType.replace(/_/g, ' ')}</span>
                      <PriorityBadge priority={req.priority} />
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{req.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      By {req.makerUserName} {req.warehouseName && `· ${req.warehouseName}`} · Level {req.currentLevel}/{req.totalLevels}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <EscalationBadge status={req.escalationStatus} />
                  <ApprovalStatusBadge status={req.status} />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Workflow Definitions Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Workflow Configurations</h3>
          <Link href="/dashboard/approvals/workflow-config" className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700">Manage →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {workflowDefinitions.filter(d => d.isActive).map((def) => (
            <div key={def.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                  {def.workflowType.replace(/_/g, ' ')}
                </span>
                <span className={`w-2 h-2 rounded-full ${def.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{def.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{def.levels.length} approval levels · {def.makerCheckerEnabled ? 'Maker-Checker ON' : 'Maker-Checker OFF'}</p>
              <div className="flex gap-1">
                {def.levels.map((lvl) => (
                  <span key={lvl.id} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    L{lvl.levelOrder}: {lvl.approverRole.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
