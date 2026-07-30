'use client';

import React from 'react';
import { RuleField, RuleOperator, ApprovalWorkflowType } from '@/store/useApprovalWorkflowStore';

const FIELD_OPTIONS: { value: RuleField; label: string }[] = [
  { value: 'ORDER_VALUE', label: 'Order Value (₹)' },
  { value: 'QUANTITY', label: 'Quantity (Units)' },
  { value: 'ASSET_VALUE', label: 'Asset Value (₹)' },
  { value: 'PRIORITY', label: 'Priority' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'DEPARTMENT', label: 'Department' },
  { value: 'ASSET_CATEGORY', label: 'Asset Category' },
  { value: 'BUSINESS_UNIT', label: 'Business Unit' },
  { value: 'REQUEST_TYPE', label: 'Request Type' },
];

const OPERATOR_OPTIONS: { value: RuleOperator; label: string }[] = [
  { value: 'GREATER_THAN', label: 'Greater Than (>)' },
  { value: 'LESS_THAN', label: 'Less Than (<)' },
  { value: 'EQUALS', label: 'Equals (=)' },
  { value: 'NOT_EQUALS', label: 'Not Equals (≠)' },
  { value: 'GREATER_OR_EQUAL', label: 'Greater or Equal (≥)' },
  { value: 'LESS_OR_EQUAL', label: 'Less or Equal (≤)' },
  { value: 'IN', label: 'In List' },
  { value: 'NOT_IN', label: 'Not In List' },
  { value: 'CONTAINS', label: 'Contains' },
];

const WORKFLOW_OPTIONS: { value: ApprovalWorkflowType; label: string }[] = [
  { value: 'PURCHASE_ORDER', label: 'Purchase Order' },
  { value: 'GOODS_RECEIPT', label: 'Goods Receipt (GRN)' },
  { value: 'ASSET_REGISTRATION', label: 'Asset Registration' },
  { value: 'ASSET_DISPOSAL', label: 'Asset Disposal' },
  { value: 'ASSET_TRANSFER', label: 'Asset Transfer' },
  { value: 'INVENTORY_ADJUSTMENT', label: 'Inventory Adjustment' },
  { value: 'STOCK_TRANSFER', label: 'Stock Transfer' },
  { value: 'WAREHOUSE_TRANSFER', label: 'Warehouse Transfer' },
  { value: 'OUTBOUND_DISPATCH', label: 'Outbound Dispatch' },
  { value: 'GATE_PASS', label: 'Gate Pass' },
  { value: 'USER_INVITATION', label: 'User Invitation' },
];

const APPROVER_ROLES = [
  'WAREHOUSE_MANAGER', 'COMPANY_ADMIN', 'FINANCE', 'SUPERVISOR', 'INVENTORY_MANAGER', 'ASSET_MANAGER', 'SECURITY_OFFICER', 'HR',
];

interface RuleBuilderProps {
  field: RuleField;
  operator: RuleOperator;
  value: string;
  workflowType: ApprovalWorkflowType;
  requiredApproverRole: string;
  onChange: (updates: { field?: RuleField; operator?: RuleOperator; value?: string; workflowType?: ApprovalWorkflowType; requiredApproverRole?: string }) => void;
}

export function RuleBuilder({ field, operator, value, workflowType, requiredApproverRole, onChange }: RuleBuilderProps) {
  return (
    <div className="space-y-3">
      {/* IF Section */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/50 rounded-xl space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-200 dark:bg-amber-800/50 px-2 py-0.5 rounded">IF</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">Condition Evaluation</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={field}
            onChange={(e) => onChange({ field: e.target.value as RuleField })}
            className="text-[11px] border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          >
            {FIELD_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <select
            value={operator}
            onChange={(e) => onChange({ operator: e.target.value as RuleOperator })}
            className="text-[11px] border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          >
            {OPERATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Threshold value"
            className="text-[11px] border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          />
        </div>
      </div>

      {/* THEN Section */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-200 dark:bg-emerald-800/50 px-2 py-0.5 rounded">THEN</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Required Action</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={workflowType}
            onChange={(e) => onChange({ workflowType: e.target.value as ApprovalWorkflowType })}
            className="text-[11px] border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          >
            {WORKFLOW_OPTIONS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
          <select
            value={requiredApproverRole}
            onChange={(e) => onChange({ requiredApproverRole: e.target.value })}
            className="text-[11px] border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="">Select Required Approver Role</option>
            {APPROVER_ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Rule Preview:</p>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-amber-600">IF</span>{' '}
          {FIELD_OPTIONS.find(f => f.value === field)?.label || field}{' '}
          {OPERATOR_OPTIONS.find(o => o.value === operator)?.label || operator}{' '}
          <strong>{value || '...'}</strong>{' '}
          <span className="font-bold text-emerald-600">THEN</span>{' '}
          Require <strong>{requiredApproverRole?.replace(/_/g, ' ') || '...'}</strong> Approval for {WORKFLOW_OPTIONS.find(w => w.value === workflowType)?.label || workflowType}
        </p>
      </div>
    </div>
  );
}

export { WORKFLOW_OPTIONS, FIELD_OPTIONS, OPERATOR_OPTIONS, APPROVER_ROLES };
