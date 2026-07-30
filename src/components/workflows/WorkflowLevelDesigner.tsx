'use client';

import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { WorkflowLevel } from '@/store/useApprovalWorkflowStore';

const ROLE_OPTIONS = [
  'WAREHOUSE_MANAGER', 'COMPANY_ADMIN', 'FINANCE', 'SUPERVISOR',
  'INVENTORY_MANAGER', 'ASSET_MANAGER', 'SECURITY_OFFICER', 'HR', 'AUDITOR',
];

interface WorkflowLevelDesignerProps {
  levels: WorkflowLevel[];
  onChange: (levels: WorkflowLevel[]) => void;
}

export function WorkflowLevelDesigner({ levels, onChange }: WorkflowLevelDesignerProps) {
  const addLevel = () => {
    const newLevel: WorkflowLevel = {
      id: `lvl-new-${Date.now()}`,
      levelOrder: levels.length + 1,
      levelName: `Level ${levels.length + 1} Approval`,
      approverRole: 'WAREHOUSE_MANAGER',
      escalationHours: 24,
    };
    onChange([...levels, newLevel]);
  };

  const removeLevel = (idx: number) => {
    const updated = levels.filter((_, i) => i !== idx).map((lvl, i) => ({ ...lvl, levelOrder: i + 1 }));
    onChange(updated);
  };

  const updateLevel = (idx: number, field: string, value: any) => {
    const updated = levels.map((lvl, i) => i === idx ? { ...lvl, [field]: value } : lvl);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Approval Levels ({levels.length})</h4>
        <button
          onClick={addLevel}
          className="flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Level
        </button>
      </div>

      {levels.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          <p className="text-xs text-slate-400">No approval levels configured. Click &ldquo;Add Level&rdquo; to start.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {levels.map((level, idx) => (
            <div key={level.id} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl group">
              <div className="flex items-center gap-1 flex-shrink-0 pt-1">
                <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">{idx + 1}</span>
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={level.levelName}
                  onChange={(e) => updateLevel(idx, 'levelName', e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white"
                  placeholder="Level name"
                />
                <div className="flex gap-2">
                  <select
                    value={level.approverRole}
                    onChange={(e) => updateLevel(idx, 'approverRole', e.target.value)}
                    className="flex-1 text-[11px] border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
                  >
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={level.escalationHours}
                      onChange={(e) => updateLevel(idx, 'escalationHours', parseInt(e.target.value) || 24)}
                      className="w-14 text-[11px] text-center border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg px-1 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
                      min={1}
                    />
                    <span className="text-[10px] text-slate-400">hrs</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeLevel(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
