import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  formula: string;
  target: number;
  actual: number;
  unit: '%' | 'Hours' | '₹' | 'Rate';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  warehouseName: string;
  department: string;
  status: 'MEETING_TARGET' | 'AT_RISK' | 'CRITICAL';
}

export interface SlaConfiguration {
  id: string;
  customerName: string;
  warehouseName: string;
  activity: string; // Dock to Stock, Picking SLA, Dispatch SLA
  targetHours: number;
  toleranceHrs: number;
  penaltyFee: number;
  priority: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export interface SlaBreachAlert {
  id: string;
  customerName: string;
  activity: string;
  targetHours: number;
  actualHours: number;
  penaltyAmount: number;
  timestamp: string;
  warehouseName: string;
}

interface KpiSlaState {
  kpis: KpiDefinition[];
  slas: SlaConfiguration[];
  breaches: SlaBreachAlert[];
  addKpi: (kpi: Omit<KpiDefinition, 'id'>) => void;
  addSla: (sla: Omit<SlaConfiguration, 'id'>) => void;
}

const INITIAL_KPIS: KpiDefinition[] = [
  { id: 'kpi-1', name: 'Inventory Accuracy', description: 'Matched stock count vs ERP balance', formula: '(Matched Items / Total Audited) * 100', target: 99.5, actual: 99.8, unit: '%', frequency: 'DAILY', warehouseName: 'Mumbai Central Mega Hub', department: 'Inventory', status: 'MEETING_TARGET' },
  { id: 'kpi-2', name: 'Dock to Stock Time', description: 'Time from truck arrival to bin put-away', formula: 'Avg(PutAwayTimestamp - GateInTimestamp)', target: 3.0, actual: 2.4, unit: 'Hours', frequency: 'DAILY', warehouseName: 'Mumbai Central Mega Hub', department: 'Inbound', status: 'MEETING_TARGET' },
  { id: 'kpi-3', name: 'GRN Generation SLA', description: 'GRN issued within target hours', formula: '(GRNs within SLA / Total GRNs) * 100', target: 98.0, actual: 94.5, unit: '%', frequency: 'WEEKLY', warehouseName: 'Delhi North Logistics Park', department: 'Inbound', status: 'AT_RISK' },
  { id: 'kpi-4', name: 'Picking Accuracy', description: 'Error-free order pick rate', formula: '(Correct Picks / Total Picks) * 100', target: 99.9, actual: 99.7, unit: '%', frequency: 'DAILY', warehouseName: 'Mumbai Central Mega Hub', department: 'Outbound', status: 'MEETING_TARGET' },
  { id: 'kpi-5', name: 'On-Time Dispatch (OTD)', description: 'Shipments dispatched before cut-off', formula: '(OnTime Orders / Total Orders) * 100', target: 97.0, actual: 92.1, unit: '%', frequency: 'WEEKLY', warehouseName: 'Bangalore Tech Depot', department: 'Transportation', status: 'CRITICAL' },
];

const INITIAL_SLAS: SlaConfiguration[] = [
  { id: 'sla-1', customerName: 'Mahindra Auto Parts', warehouseName: 'Mumbai Central Mega Hub', activity: 'Inbound Dock-to-Stock', targetHours: 2.5, toleranceHrs: 0.5, penaltyFee: 5000, priority: 'CRITICAL' },
  { id: 'sla-2', customerName: 'Reliance Industrial Supplies', warehouseName: 'Delhi North Logistics Park', activity: 'Same-Day Dispatch SLA', targetHours: 4.0, toleranceHrs: 1.0, penaltyFee: 10000, priority: 'HIGH' },
];

const INITIAL_BREACHES: SlaBreachAlert[] = [
  { id: 'br-1', customerName: 'Reliance Industrial Supplies', activity: 'Same-Day Dispatch SLA', targetHours: 4.0, actualHours: 5.2, penaltyAmount: 10000, timestamp: 'Today 11:30 AM', warehouseName: 'Delhi North Logistics Park' },
];

export const useKpiSlaStore = create<KpiSlaState>()(
  persist(
    (set) => ({
      kpis: INITIAL_KPIS,
      slas: INITIAL_SLAS,
      breaches: INITIAL_BREACHES,
      addKpi: (kpi) => set((state) => ({ kpis: [{ ...kpi, id: `kpi-${Date.now()}` }, ...state.kpis] })),
      addSla: (sla) => set((state) => ({ slas: [{ ...sla, id: `sla-${Date.now()}` }, ...state.slas] })),
    }),
    { name: 'sankaj-kpi-sla-storage' }
  )
);
