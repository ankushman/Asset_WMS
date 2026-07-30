'use client';

import React, { useState } from 'react';
import { useApprovalWorkflowStore, BusinessRule, RuleField, RuleOperator, ApprovalWorkflowType } from '@/store/useApprovalWorkflowStore';
import { RuleBuilder, FIELD_OPTIONS, OPERATOR_OPTIONS, WORKFLOW_OPTIONS } from '@/components/workflows/RuleBuilder';
import { GitBranchPlus, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, ShieldAlert } from 'lucide-react';

export default function BusinessRulesPage() {
  const { businessRules, addBusinessRule, updateBusinessRule, deleteBusinessRule, toggleRuleActive } = useApprovalWorkflowStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formField, setFormField] = useState<RuleField>('ORDER_VALUE');
  const [formOperator, setFormOperator] = useState<RuleOperator>('GREATER_THAN');
  const [formValue, setFormValue] = useState('10000');
  const [formWorkflowType, setFormWorkflowType] = useState<ApprovalWorkflowType>('PURCHASE_ORDER');
  const [formRequiredRole, setFormRequiredRole] = useState('FINANCE');
  const [formPriority, setFormPriority] = useState(10);

  const openCreateModal = () => {
    setEditingId(null);
    setFormName('High Value PO Finance Rule');
    setFormDesc('Require Finance Approval for purchase orders over $10,000');
    setFormField('ORDER_VALUE');
    setFormOperator('GREATER_THAN');
    setFormValue('10000');
    setFormWorkflowType('PURCHASE_ORDER');
    setFormRequiredRole('FINANCE');
    setFormPriority(10);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: BusinessRule) => {
    setEditingId(rule.id);
    setFormName(rule.name);
    setFormDesc(rule.description || '');
    setFormField(rule.field);
    setFormOperator(rule.operator);
    setFormValue(rule.value);
    setFormWorkflowType(rule.workflowType);
    setFormRequiredRole(rule.requiredApproverRole || 'FINANCE');
    setFormPriority(rule.priority || 0);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formValue.trim()) return;

    if (editingId) {
      updateBusinessRule(editingId, {
        name: formName,
        description: formDesc,
        field: formField,
        operator: formOperator,
        value: formValue,
        workflowType: formWorkflowType,
        requiredApproverRole: formRequiredRole,
        priority: formPriority,
      });
    } else {
      addBusinessRule({
        companyId: 'comp-001',
        name: formName,
        description: formDesc,
        field: formField,
        operator: formOperator,
        value: formValue,
        workflowType: formWorkflowType,
        requiredApproverRole: formRequiredRole,
        additionalLevels: 1,
        isActive: true,
        priority: formPriority,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranchPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Configurable Business Rules Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Define dynamic IF-THEN conditions to trigger required approval levels based on monetary value, quantities, priorities, and departments.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Business Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 gap-3">
        {businessRules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {rule.workflowType.replace(/_/g, ' ')}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Priority: {rule.priority}
                </span>
                <button
                  onClick={() => toggleRuleActive(rule.id)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 ml-auto md:ml-0"
                >
                  {rule.isActive ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  {rule.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                {rule.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rule.description}</p>}
              </div>

              {/* IF-THEN Expression Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-[10px]">IF</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {FIELD_OPTIONS.find(f => f.value === rule.field)?.label || rule.field}
                </span>
                <span className="text-slate-500">{OPERATOR_OPTIONS.find(o => o.value === rule.operator)?.label || rule.operator}</span>
                <span className="font-bold text-orange-600 dark:text-orange-400 font-mono bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded">{rule.value}</span>
                <span className="font-extrabold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">THEN</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Require <strong className="text-emerald-600 dark:text-emerald-400">{rule.requiredApproverRole?.replace(/_/g, ' ') || 'Approval'}</strong>
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
              <button
                onClick={() => openEditModal(rule)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => deleteBusinessRule(rule.id)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Business Rule' : 'Create New Business Rule'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  placeholder="Rule Name"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  placeholder="Rule Description"
                />
              </div>

              <RuleBuilder
                field={formField}
                operator={formOperator}
                value={formValue}
                workflowType={formWorkflowType}
                requiredApproverRole={formRequiredRole}
                onChange={(updates) => {
                  if (updates.field) setFormField(updates.field);
                  if (updates.operator) setFormOperator(updates.operator);
                  if (updates.value !== undefined) setFormValue(updates.value);
                  if (updates.workflowType) setFormWorkflowType(updates.workflowType);
                  if (updates.requiredApproverRole) setFormRequiredRole(updates.requiredApproverRole);
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md">
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
