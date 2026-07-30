'use client';

import React, { useState } from 'react';
import { useApprovalWorkflowStore, WorkflowDefinition, ApprovalWorkflowType } from '@/store/useApprovalWorkflowStore';
import { WorkflowLevelDesigner } from '@/components/workflows/WorkflowLevelDesigner';
import { Settings2, Plus, Edit2, Trash2, CheckCircle2, XCircle, ShieldCheck, Layers, ToggleLeft, ToggleRight, X } from 'lucide-react';

const WORKFLOW_TYPES: { value: ApprovalWorkflowType; label: string; desc: string }[] = [
  { value: 'PURCHASE_ORDER', label: 'Purchase Orders', desc: 'Procurement and PO approval pipeline' },
  { value: 'GOODS_RECEIPT', label: 'Goods Receipt (GRN)', desc: 'Inbound GRN receiving approval' },
  { value: 'ASSET_REGISTRATION', label: 'Asset Registration', desc: 'New capital equipment registration' },
  { value: 'ASSET_DISPOSAL', label: 'Asset Disposal', desc: 'Decommissioning & asset disposal' },
  { value: 'ASSET_TRANSFER', label: 'Asset Transfer', desc: 'Inter-facility asset transfer' },
  { value: 'INVENTORY_ADJUSTMENT', label: 'Inventory Adjustment', desc: 'Stock count variance adjustment' },
  { value: 'STOCK_TRANSFER', label: 'Stock Transfer', desc: 'Inter-warehouse inventory balancing' },
  { value: 'WAREHOUSE_TRANSFER', label: 'Warehouse Transfer', desc: 'Facility asset & inventory transfer' },
  { value: 'OUTBOUND_DISPATCH', label: 'Outbound Dispatch', desc: 'High-value outbound dispatch signoff' },
  { value: 'GATE_PASS', label: 'Gate Pass Approval', desc: 'Vehicle gate-out clearance approval' },
  { value: 'USER_INVITATION', label: 'User Invitation', desc: 'New system user onboarding approval' },
];

export default function WorkflowConfigPage() {
  const { workflowDefinitions, addWorkflowDefinition, updateWorkflowDefinition, deleteWorkflowDefinition, toggleWorkflowActive } = useApprovalWorkflowStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formType, setFormType] = useState<ApprovalWorkflowType>('PURCHASE_ORDER');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMakerChecker, setFormMakerChecker] = useState(true);
  const [formLevels, setFormLevels] = useState<any[]>([
    { id: 'lvl-1', levelOrder: 1, levelName: 'Level 1 Review', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
  ]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormType('PURCHASE_ORDER');
    setFormName('Purchase Order Approval');
    setFormDesc('Configurable multi-level approval workflow for purchase orders');
    setFormMakerChecker(true);
    setFormLevels([
      { id: 'lvl-1', levelOrder: 1, levelName: 'Warehouse Manager Review', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
      { id: 'lvl-2', levelOrder: 2, levelName: 'Finance Approval', approverRole: 'FINANCE', escalationHours: 24 },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (def: WorkflowDefinition) => {
    setEditingId(def.id);
    setFormType(def.workflowType);
    setFormName(def.name);
    setFormDesc(def.description || '');
    setFormMakerChecker(def.makerCheckerEnabled);
    setFormLevels(def.levels || []);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    if (editingId) {
      updateWorkflowDefinition(editingId, {
        name: formName,
        description: formDesc,
        makerCheckerEnabled: formMakerChecker,
        levels: formLevels,
      });
    } else {
      addWorkflowDefinition({
        companyId: 'comp-001',
        workflowType: formType,
        name: formName,
        description: formDesc,
        isActive: true,
        makerCheckerEnabled: formMakerChecker,
        levels: formLevels,
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
            <Settings2 className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Workflow Configurations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure multi-level approval workflows for enterprise warehouse processes.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowDefinitions.map((def) => (
          <div key={def.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                  {def.workflowType.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => toggleWorkflowActive(def.id)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  {def.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-500" /> Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" /> Inactive
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{def.name}</h3>
                {def.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{def.description}</p>}
              </div>

              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3 h-3 text-orange-500" />
                  Maker-Checker: {def.makerCheckerEnabled ? 'ON' : 'OFF'}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                  <Layers className="w-3 h-3 text-blue-500" />
                  {def.levels.length} Level(s)
                </span>
              </div>

              {/* Levels sequence */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {def.levels.map((lvl) => (
                  <div key={lvl.id} className="flex items-center justify-between text-[11px] p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      L{lvl.levelOrder}: {lvl.levelName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{lvl.approverRole.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => openEditModal(def)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => deleteWorkflowDefinition(def.id)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Workflow Configuration' : 'Create New Workflow Configuration'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {!editingId && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Process Type</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const type = e.target.value as ApprovalWorkflowType;
                      setFormType(type);
                      const config = WORKFLOW_TYPES.find(t => t.value === type);
                      if (config) {
                        setFormName(`${config.label} Approval`);
                        setFormDesc(config.desc);
                      }
                    }}
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white"
                  >
                    {WORKFLOW_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white"
                  placeholder="Workflow Name"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white resize-none"
                  placeholder="Description of workflow purpose"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Maker-Checker Governance</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Prevent request creator from approving their own request</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormMakerChecker(!formMakerChecker)}
                  className="text-[11px] font-bold text-orange-600 dark:text-orange-400"
                >
                  {formMakerChecker ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                </button>
              </div>

              <WorkflowLevelDesigner levels={formLevels} onChange={setFormLevels} />
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md">
                Save Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
