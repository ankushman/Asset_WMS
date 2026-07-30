'use client';

import React, { useState } from 'react';
import { Workflow, Plus, Zap, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { useAutomationStore, WorkflowRule } from '@/store/useAutomationStore';

export default function AutomationPage() {
  const { rules, toggleRule, addRule } = useAutomationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<WorkflowRule['trigger']>('LOW_STOCK');
  const [condition, setCondition] = useState('Available Stock < Safety Min Level');
  const [action, setAction] = useState<WorkflowRule['action']>('CREATE_PURCHASE_REQ');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    addRule({ name, trigger, condition, action, isActive: true });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            No-Code Workflow Automation Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated rules: IF condition met THEN execute automated notifications, purchase requests, or tickets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Automation Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                  {rule.trigger}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rule.name}</h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  <strong>IF:</strong> {rule.condition}
                </span>
                <span className="text-royal-500 font-bold">&rarr;</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                  <strong>THEN:</strong> {rule.action.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${rule.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                {rule.isActive ? 'Active' : 'Disabled'}
              </span>
              <button
                onClick={() => toggleRule(rule.id)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${rule.isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${rule.isActive ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Automation Rule
            </h3>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Auto-Notify Transport Manager on Delay"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Trigger Event</label>
                  <select
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="LOW_STOCK">LOW_STOCK</option>
                    <option value="SLA_BREACH">SLA_BREACH</option>
                    <option value="MAINTENANCE_DUE">MAINTENANCE_DUE</option>
                    <option value="DELAYED_SHIPMENT">DELAYED_SHIPMENT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Automated Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="NOTIFY_MANAGER">NOTIFY_MANAGER</option>
                    <option value="CREATE_PURCHASE_REQ">CREATE_PURCHASE_REQ</option>
                    <option value="ESCALATE_TICKET">ESCALATE_TICKET</option>
                    <option value="NOTIFY_CUSTOMER">NOTIFY_CUSTOMER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Condition Expression</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-royal-600 rounded-xl hover:bg-royal-700 shadow-md"
                >
                  Save & Enable Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
