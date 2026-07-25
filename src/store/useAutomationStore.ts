import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: 'LOW_STOCK' | 'SLA_BREACH' | 'MAINTENANCE_DUE' | 'DELAYED_SHIPMENT';
  condition: string;
  action: 'NOTIFY_MANAGER' | 'CREATE_PURCHASE_REQ' | 'ESCALATE_TICKET' | 'NOTIFY_CUSTOMER';
  isActive: boolean;
}

interface AutomationState {
  rules: WorkflowRule[];
  toggleRule: (id: string) => void;
  addRule: (rule: Omit<WorkflowRule, 'id'>) => void;
}

const INITIAL_RULES: WorkflowRule[] = [
  { id: 'rule-1', name: 'Auto-Create Purchase Req on Low Inventory', trigger: 'LOW_STOCK', condition: 'Available Stock < Safety Min Level', action: 'CREATE_PURCHASE_REQ', isActive: true },
  { id: 'rule-2', name: 'Escalate SLA Breach to Executive Level', trigger: 'SLA_BREACH', condition: 'Dock-to-Stock SLA > Target Hours + 30 mins', action: 'ESCALATE_TICKET', isActive: true },
  { id: 'rule-3', name: 'Alert Fleet Operator when Shipment Delayed', trigger: 'DELAYED_SHIPMENT', condition: 'Expected Arrival Delay > 1 Hour', action: 'NOTIFY_CUSTOMER', isActive: true },
  { id: 'rule-4', name: 'Auto Maintenance Ticket on Low Battery/Vibration', trigger: 'MAINTENANCE_DUE', condition: 'MHE Battery Status < 20% or Health == MAINTENANCE_DUE', action: 'NOTIFY_MANAGER', isActive: true },
];

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      rules: INITIAL_RULES,
      toggleRule: (id) => set((state) => ({ rules: state.rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)) })),
      addRule: (rule) => set((state) => ({ rules: [{ ...rule, id: `rule-${Date.now()}` }, ...state.rules] })),
    }),
    { name: 'ennea-automation-storage' }
  )
);
