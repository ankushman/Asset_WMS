import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Equipment {
  id: string;
  equipmentCode: string;
  name: string;
  type: 'FORKLIFT' | 'REACH_TRUCK' | 'HAND_PALLET' | 'STACKER' | 'BATTERY_UNIT' | 'DOCK_EQUIPMENT' | 'SCANNER';
  warehouseId: string;
  warehouseName: string;
  batteryStatus: number; // %
  healthStatus: 'EXCELLENT' | 'GOOD' | 'MAINTENANCE_DUE' | 'DOWN';
  hoursUsed: number;
  downtimeHours: number;
  operatorName?: string;
  lastService: string;
  nextService: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  serviceType: 'PREVENTIVE' | 'CORRECTIVE';
  technician: string;
  cost: number;
  partsUsed: string;
  downtimeHrs: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}

interface MheState {
  equipments: Equipment[];
  maintenances: EquipmentMaintenance[];
  addEquipment: (eq: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, eq: Partial<Equipment>) => void;
  addMaintenanceRecord: (m: Omit<EquipmentMaintenance, 'id'>) => void;
}

const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'mhe-001', equipmentCode: 'MHE-FRK-01', name: 'Toyota 3-Ton Electric Forklift', type: 'FORKLIFT', warehouseId: 'wh-001', warehouseName: 'Mumbai Central Mega Hub', batteryStatus: 85, healthStatus: 'EXCELLENT', hoursUsed: 1420, downtimeHours: 12, operatorName: 'Priya Sundaram', lastService: '2026-06-15', nextService: '2026-09-15' },
  { id: 'mhe-002', equipmentCode: 'MHE-RCH-04', name: 'Crown High-Reach Truck 12m', type: 'REACH_TRUCK', warehouseId: 'wh-001', warehouseName: 'Mumbai Central Mega Hub', batteryStatus: 42, healthStatus: 'GOOD', hoursUsed: 2150, downtimeHours: 24, operatorName: 'Rohan Deshmukh', lastService: '2026-05-10', nextService: '2026-08-10' },
  { id: 'mhe-003', equipmentCode: 'MHE-STK-09', name: 'Jungheinrich Electric Stacker 1.6T', type: 'STACKER', warehouseId: 'wh-002', warehouseName: 'Delhi North Logistics Park', batteryStatus: 18, healthStatus: 'MAINTENANCE_DUE', hoursUsed: 1890, downtimeHours: 48, operatorName: 'Delhi Ops Team', lastService: '2026-04-01', nextService: '2026-07-01' },
];

const INITIAL_MAINTENANCE: EquipmentMaintenance[] = [
  { id: 'maint-1', equipmentId: 'mhe-003', equipmentCode: 'MHE-STK-09', serviceType: 'PREVENTIVE', technician: 'Konecranes India Support', cost: 14500, partsUsed: 'Hydraulic Seals, Battery Cell Balancer', downtimeHrs: 6.5, status: 'SCHEDULED' },
];

export const useMheStore = create<MheState>()(
  persist(
    (set) => ({
      equipments: INITIAL_EQUIPMENT,
      maintenances: INITIAL_MAINTENANCE,
      addEquipment: (eq) => set((state) => ({ equipments: [{ ...eq, id: `mhe-${Date.now()}` }, ...state.equipments] })),
      updateEquipment: (id, data) => set((state) => ({ equipments: state.equipments.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
      addMaintenanceRecord: (m) => set((state) => ({ maintenances: [{ ...m, id: `maint-${Date.now()}` }, ...state.maintenances] })),
    }),
    { name: 'sankaj-mhe-storage' }
  )
);
