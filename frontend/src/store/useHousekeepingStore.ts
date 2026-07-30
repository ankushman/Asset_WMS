import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HousekeepingStaff {
  id: string;
  warehouseId: string;
  employeeId: string;
  name: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE';
  assignedArea: string;
  supervisor: string;
  phone: string;
  employmentType: 'Contract' | 'Permanent';
  currentTask: string;
  taskStatus: 'Completed' | 'In Progress' | 'Pending';
}

export interface AreaCleaningStatus {
  id: string;
  warehouseId: string;
  areaName: string;
  status: 'Completed' | 'Pending' | 'In Progress' | 'Overdue';
  lastCleaned: string;
  nextScheduled: string;
  assignedEmployee: string;
  supervisor: string;
  remarks: string;
}

export interface CleaningTask {
  id: string;
  warehouseId: string;
  taskName: string;
  assignedStaff: string;
  priority: 'High' | 'Medium' | 'Low';
  scheduledTime: string;
  completionTime: string;
  status: 'Completed' | 'Pending' | 'In Progress' | 'Overdue';
  remarks: string;
  photosBefore?: string;
  photosAfter?: string;
}

export interface ToiletCleaningLog {
  id: string;
  warehouseId: string;
  location: string;
  totalToilets: number;
  cleanedToday: number;
  pending: number;
  frequency: string;
  assignedStaff: string;
  lastCleanedTime: string;
  inspectionStatus: 'PASSED' | 'RE_CLEANING_REQUIRED' | 'PENDING';
  consumables: {
    soap: 'Full' | 'Refill Required' | 'Good';
    tissuePaper: 'Full' | 'Low' | 'Refilled';
    handWash: 'Full' | 'Refill Required';
    airFreshener: 'Active' | 'Replaced';
    sanitizer: 'Full' | 'Low';
  };
}

export interface GarbageRecord {
  id: string;
  warehouseId: string;
  wasteType: 'Dry Waste' | 'Wet Waste' | 'Plastic Waste' | 'Hazardous Waste' | 'Rejected Packaging' | 'Scrap Material';
  collectionTime: string;
  collectedBy: string;
  disposalMethod: string;
  weightKg: number;
  vendor: string;
  status: 'Collected' | 'Disposed' | 'In-Transit';
}

export interface HousekeepingInspection {
  id: string;
  warehouseId: string;
  inspectionDate: string;
  inspectorName: string;
  cleanlinessScore: number; // 0 - 100
  safetyScore: number; // 0 - 100
  hygieneScore: number; // 0 - 100
  remarks: string;
  correctiveActions: string;
  status: 'APPROVED' | 'REQUIRES_ACTION';
}

interface HousekeepingState {
  staff: HousekeepingStaff[];
  areaStatuses: AreaCleaningStatus[];
  tasks: CleaningTask[];
  toiletLogs: ToiletCleaningLog[];
  garbageRecords: GarbageRecord[];
  inspections: HousekeepingInspection[];
  updateTaskStatus: (taskId: string, status: CleaningTask['status'], remarks?: string) => void;
  updateAreaStatus: (areaId: string, status: AreaCleaningStatus['status'], lastCleaned?: string) => void;
  addInspection: (inspection: Omit<HousekeepingInspection, 'id'>) => void;
  addGarbageRecord: (record: Omit<GarbageRecord, 'id'>) => void;
  addStaff: (member: Omit<HousekeepingStaff, 'id'>) => void;
}

const INITIAL_STAFF: HousekeepingStaff[] = [
  {
    id: 'hs-101',
    warehouseId: 'wh-001',
    employeeId: 'HK-MUM-01',
    name: 'Santosh Kamble',
    role: 'Lead Sanitation Specialist',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    assignedArea: 'Receiving & Loading Docks',
    supervisor: 'Priya Sundaram',
    phone: '+91 98112 33445',
    employmentType: 'Permanent',
    currentTask: 'Dock Bay High-Pressure Wash',
    taskStatus: 'In Progress',
  },
  {
    id: 'hs-102',
    warehouseId: 'wh-001',
    employeeId: 'HK-MUM-02',
    name: 'Savitri Devi',
    role: 'Sanitation Attendant',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    assignedArea: 'Office & Meeting Rooms',
    supervisor: 'Rajesh Sharma',
    phone: '+91 97223 44556',
    employmentType: 'Contract',
    currentTask: 'Executive Pantry Sanitization',
    taskStatus: 'Completed',
  },
  {
    id: 'hs-103',
    warehouseId: 'wh-001',
    employeeId: 'HK-MUM-03',
    name: 'Ramesh Pawar',
    role: 'Floor Auto-Scrubber Operator',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    assignedArea: 'Storage Zone A & B',
    supervisor: 'Priya Sundaram',
    phone: '+91 96334 55667',
    employmentType: 'Permanent',
    currentTask: 'Main Aisle Floor Mopping',
    taskStatus: 'Completed',
  },
  {
    id: 'hs-104',
    warehouseId: 'wh-001',
    employeeId: 'HK-MUM-04',
    name: 'Sunita Gaikwad',
    role: 'Washroom & Hygiene Cleaner',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    assignedArea: 'Main Washroom Block A & B',
    supervisor: 'Priya Sundaram',
    phone: '+91 95445 66778',
    employmentType: 'Contract',
    currentTask: 'Sanitizer & Tissue Refill',
    taskStatus: 'Completed',
  },
  {
    id: 'hs-105',
    warehouseId: 'wh-001',
    employeeId: 'HK-MUM-05',
    name: 'Anil Shinde',
    role: 'Waste & Scrap Manager',
    shift: 'Evening',
    attendanceStatus: 'PRESENT',
    assignedArea: 'Packing & Scrap Yard',
    supervisor: 'Rajesh Sharma',
    phone: '+91 94556 77889',
    employmentType: 'Permanent',
    currentTask: 'Cardboard Scrap Baling',
    taskStatus: 'Pending',
  },
];

const INITIAL_AREAS: AreaCleaningStatus[] = [
  { id: 'area-1', warehouseId: 'wh-001', areaName: 'Receiving Area', status: 'Completed', lastCleaned: '08:30 AM', nextScheduled: '01:30 PM', assignedEmployee: 'Santosh Kamble', supervisor: 'Priya Sundaram', remarks: 'Floor degreased and clear of pallet debris.' },
  { id: 'area-2', warehouseId: 'wh-001', areaName: 'Dispatch Area', status: 'In Progress', lastCleaned: '07:45 AM', nextScheduled: '12:00 PM', assignedEmployee: 'Ramesh Pawar', supervisor: 'Priya Sundaram', remarks: 'Auto-scrubber running on Outbound Lane 3.' },
  { id: 'area-3', warehouseId: 'wh-001', areaName: 'Storage Area (Zone A-D)', status: 'Completed', lastCleaned: '09:00 AM', nextScheduled: '03:00 PM', assignedEmployee: 'Ramesh Pawar', supervisor: 'Priya Sundaram', remarks: 'Racks vacuumed and aisles swept.' },
  { id: 'area-4', warehouseId: 'wh-001', areaName: 'Picking Area', status: 'Completed', lastCleaned: '08:15 AM', nextScheduled: '02:00 PM', assignedEmployee: 'Santosh Kamble', supervisor: 'Priya Sundaram', remarks: 'Loose bin dust removed.' },
  { id: 'area-5', warehouseId: 'wh-001', areaName: 'Packing Area', status: 'Pending', lastCleaned: '06:30 AM', nextScheduled: '11:30 AM', assignedEmployee: 'Anil Shinde', supervisor: 'Rajesh Sharma', remarks: 'Packaging plastic wrap collection scheduled.' },
  { id: 'area-6', warehouseId: 'wh-001', areaName: 'Quality Inspection Area', status: 'Completed', lastCleaned: '08:00 AM', nextScheduled: '01:00 PM', assignedEmployee: 'Savitri Devi', supervisor: 'Priya Sundaram', remarks: 'Sanitized and bench wiped.' },
  { id: 'area-7', warehouseId: 'wh-001', areaName: 'Office Area & Cabins', status: 'Completed', lastCleaned: '07:30 AM', nextScheduled: '04:00 PM', assignedEmployee: 'Savitri Devi', supervisor: 'Rajesh Sharma', remarks: 'Dusting and glass cleaning completed.' },
  { id: 'area-8', warehouseId: 'wh-001', areaName: 'Meeting Rooms', status: 'Completed', lastCleaned: '08:45 AM', nextScheduled: '02:30 PM', assignedEmployee: 'Savitri Devi', supervisor: 'Rajesh Sharma', remarks: 'Tables sanitized and whiteboards cleaned.' },
  { id: 'area-9', warehouseId: 'wh-001', areaName: 'Washrooms Block A & B', status: 'Completed', lastCleaned: '09:15 AM', nextScheduled: '11:15 AM', assignedEmployee: 'Sunita Gaikwad', supervisor: 'Priya Sundaram', remarks: 'Mopped with disinfectant & consumables refilled.' },
  { id: 'area-10', warehouseId: 'wh-001', areaName: 'Pantry & Breakroom', status: 'Completed', lastCleaned: '09:00 AM', nextScheduled: '01:00 PM', assignedEmployee: 'Savitri Devi', supervisor: 'Rajesh Sharma', remarks: 'Countertops sanitized and bin emptied.' },
  { id: 'area-11', warehouseId: 'wh-001', areaName: 'Parking Area & Yard', status: 'Overdue', lastCleaned: 'Yesterday 05:00 PM', nextScheduled: '08:00 AM', assignedEmployee: 'Anil Shinde', supervisor: 'Rajesh Sharma', remarks: 'Pending sweeper truck run due to rain.' },
  { id: 'area-12', warehouseId: 'wh-001', areaName: 'Security Cabin', status: 'Completed', lastCleaned: '07:00 AM', nextScheduled: '03:00 PM', assignedEmployee: 'Santosh Kamble', supervisor: 'Priya Sundaram', remarks: 'Desk disinfected.' },
  { id: 'area-13', warehouseId: 'wh-001', areaName: 'Loading Bays & Apron', status: 'In Progress', lastCleaned: '08:00 AM', nextScheduled: '12:30 PM', assignedEmployee: 'Santosh Kamble', supervisor: 'Priya Sundaram', remarks: 'High-pressure water washing underway.' },
  { id: 'area-14', warehouseId: 'wh-001', areaName: 'Dock Area (Dock 1-12)', status: 'Completed', lastCleaned: '08:30 AM', nextScheduled: '02:00 PM', assignedEmployee: 'Santosh Kamble', supervisor: 'Priya Sundaram', remarks: 'Levelers cleared of debris.' },
  { id: 'area-15', warehouseId: 'wh-001', areaName: 'Staircase & Fire Escapes', status: 'Completed', lastCleaned: '07:15 AM', nextScheduled: '05:00 PM', assignedEmployee: 'Sunita Gaikwad', supervisor: 'Priya Sundaram', remarks: 'Handrails sanitized.' },
  { id: 'area-16', warehouseId: 'wh-001', areaName: 'Utility & Generator Rooms', status: 'Completed', lastCleaned: 'Yesterday 04:00 PM', nextScheduled: '04:00 PM', assignedEmployee: 'Anil Shinde', supervisor: 'Rajesh Sharma', remarks: 'Oil drips cleaned and floor dry.' },
];

const INITIAL_TASKS: CleaningTask[] = [
  { id: 'task-1', warehouseId: 'wh-001', taskName: 'Floor Sweeping', assignedStaff: 'Ramesh Pawar', priority: 'High', scheduledTime: '06:00 AM', completionTime: '07:00 AM', status: 'Completed', remarks: 'Main concourse swept cleanly.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-2', warehouseId: 'wh-001', taskName: 'Floor Mopping', assignedStaff: 'Ramesh Pawar', priority: 'High', scheduledTime: '07:00 AM', completionTime: '08:15 AM', status: 'Completed', remarks: 'Chemical disinfectant applied.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-3', warehouseId: 'wh-001', taskName: 'Dusting & Ledge Wiping', assignedStaff: 'Savitri Devi', priority: 'Medium', scheduledTime: '07:30 AM', completionTime: '08:45 AM', status: 'Completed', remarks: 'Office window sills wiped.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-4', warehouseId: 'wh-001', taskName: 'Rack Cleaning', assignedStaff: 'Santosh Kamble', priority: 'Medium', scheduledTime: '08:00 AM', completionTime: '09:30 AM', status: 'Completed', remarks: 'Zone B high racks vacuumed.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-5', warehouseId: 'wh-001', taskName: 'Shelf Cleaning', assignedStaff: 'Santosh Kamble', priority: 'Medium', scheduledTime: '09:00 AM', completionTime: '09:45 AM', status: 'Completed', remarks: 'Small parts shelves dust-free.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-6', warehouseId: 'wh-001', taskName: 'Bin Cleaning', assignedStaff: 'Ramesh Pawar', priority: 'Low', scheduledTime: '09:30 AM', completionTime: '10:15 AM', status: 'Completed', remarks: 'Pick bins wiped.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-7', warehouseId: 'wh-001', taskName: 'Equipment Cleaning', assignedStaff: 'Santosh Kamble', priority: 'High', scheduledTime: '08:30 AM', completionTime: '09:15 AM', status: 'Completed', remarks: 'Scanners & scales disinfected.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-8', warehouseId: 'wh-001', taskName: 'Forklift Cleaning', assignedStaff: 'Santosh Kamble', priority: 'Medium', scheduledTime: '10:00 AM', completionTime: 'In Progress', status: 'In Progress', remarks: 'Forklift cabin wiped.', photosBefore: 'Verified', photosAfter: 'Pending' },
  { id: 'task-9', warehouseId: 'wh-001', taskName: 'Dock Cleaning', assignedStaff: 'Santosh Kamble', priority: 'High', scheduledTime: '08:00 AM', completionTime: '08:50 AM', status: 'Completed', remarks: 'Dock levelers swept and degreased.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-10', warehouseId: 'wh-001', taskName: 'Loading Bay Cleaning', assignedStaff: 'Santosh Kamble', priority: 'High', scheduledTime: '09:00 AM', completionTime: 'In Progress', status: 'In Progress', remarks: 'Power washing active.', photosBefore: 'Verified', photosAfter: 'Pending' },
  { id: 'task-11', warehouseId: 'wh-001', taskName: 'Waste Collection', assignedStaff: 'Anil Shinde', priority: 'High', scheduledTime: '09:30 AM', completionTime: '10:20 AM', status: 'Completed', remarks: 'All aisle bins emptied.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-12', warehouseId: 'wh-001', taskName: 'Garbage Disposal', assignedStaff: 'Anil Shinde', priority: 'High', scheduledTime: '10:30 AM', completionTime: 'Pending', status: 'Pending', remarks: 'Municipal truck scheduled at 11:30 AM.', photosBefore: 'Pending', photosAfter: 'Pending' },
  { id: 'task-13', warehouseId: 'wh-001', taskName: 'Toilet Cleaning', assignedStaff: 'Sunita Gaikwad', priority: 'High', scheduledTime: '08:00 AM', completionTime: '09:00 AM', status: 'Completed', remarks: 'Block A & B fully sanitized.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-14', warehouseId: 'wh-001', taskName: 'Wash Basin Cleaning', assignedStaff: 'Sunita Gaikwad', priority: 'Medium', scheduledTime: '08:30 AM', completionTime: '09:10 AM', status: 'Completed', remarks: 'Descaled and polished.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-15', warehouseId: 'wh-001', taskName: 'Office Cleaning', assignedStaff: 'Savitri Devi', priority: 'Medium', scheduledTime: '07:00 AM', completionTime: '08:00 AM', status: 'Completed', remarks: 'Desks and carpets vacuumed.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-16', warehouseId: 'wh-001', taskName: 'Glass Cleaning', assignedStaff: 'Savitri Devi', priority: 'Low', scheduledTime: '10:00 AM', completionTime: 'Pending', status: 'Pending', remarks: 'Facade glass wiping.', photosBefore: 'Pending', photosAfter: 'Pending' },
  { id: 'task-17', warehouseId: 'wh-001', taskName: 'Parking Cleaning', assignedStaff: 'Anil Shinde', priority: 'Low', scheduledTime: '07:30 AM', completionTime: 'Overdue', status: 'Overdue', remarks: 'Yard sweeper delayed.', photosBefore: 'Pending', photosAfter: 'Pending' },
  { id: 'task-18', warehouseId: 'wh-001', taskName: 'Pest Control Inspection', assignedStaff: 'Sunita Gaikwad', priority: 'High', scheduledTime: '09:00 AM', completionTime: '09:30 AM', status: 'Completed', remarks: 'Rodent bait stations checked.', photosBefore: 'Verified', photosAfter: 'Verified' },
  { id: 'task-19', warehouseId: 'wh-001', taskName: 'Sanitization Fogging', assignedStaff: 'Sunita Gaikwad', priority: 'High', scheduledTime: '06:30 AM', completionTime: '07:15 AM', status: 'Completed', remarks: 'Cold fogging done in breakroom.', photosBefore: 'Verified', photosAfter: 'Verified' },
];

const INITIAL_TOILETS: ToiletCleaningLog[] = [
  {
    id: 'toilet-1',
    warehouseId: 'wh-001',
    location: 'Ground Floor Main Block (West)',
    totalToilets: 8,
    cleanedToday: 8,
    pending: 0,
    frequency: 'Hourly Inspection',
    assignedStaff: 'Sunita Gaikwad',
    lastCleanedTime: '09:15 AM',
    inspectionStatus: 'PASSED',
    consumables: {
      soap: 'Full',
      tissuePaper: 'Refilled',
      handWash: 'Full',
      airFreshener: 'Active',
      sanitizer: 'Full',
    },
  },
  {
    id: 'toilet-2',
    warehouseId: 'wh-001',
    location: 'First Floor Executive Office Block',
    totalToilets: 4,
    cleanedToday: 4,
    pending: 0,
    frequency: 'Every 2 Hours',
    assignedStaff: 'Savitri Devi',
    lastCleanedTime: '08:45 AM',
    inspectionStatus: 'PASSED',
    consumables: {
      soap: 'Good',
      tissuePaper: 'Full',
      handWash: 'Full',
      airFreshener: 'Active',
      sanitizer: 'Full',
    },
  },
];

const INITIAL_GARBAGE: GarbageRecord[] = [
  { id: 'garb-1', warehouseId: 'wh-001', wasteType: 'Dry Waste', collectionTime: '09:30 AM', collectedBy: 'Anil Shinde', disposalMethod: 'Municipal Segregation & Recycling', weightKg: 145, vendor: 'CleanIndia EcoServices', status: 'Collected' },
  { id: 'garb-2', warehouseId: 'wh-001', wasteType: 'Rejected Packaging', collectionTime: '08:45 AM', collectedBy: 'Anil Shinde', disposalMethod: 'Cardboard Baling & Paper Mill Recycler', weightKg: 280, vendor: 'Bhiwandi Paper Recyclers', status: 'Disposed' },
  { id: 'garb-3', warehouseId: 'wh-001', wasteType: 'Plastic Waste', collectionTime: '09:00 AM', collectedBy: 'Santosh Kamble', disposalMethod: 'Plastic Granulation Facility', weightKg: 95, vendor: 'GreenPolymer Ltd.', status: 'Disposed' },
  { id: 'garb-4', warehouseId: 'wh-001', wasteType: 'Scrap Material', collectionTime: 'Yesterday', collectedBy: 'Anil Shinde', disposalMethod: 'Authorized Metal Foundry Auction', weightKg: 420, vendor: 'Apex Scrap Processors', status: 'Disposed' },
  { id: 'garb-5', warehouseId: 'wh-001', wasteType: 'Hazardous Waste', collectionTime: '08:00 AM', collectedBy: 'Sunita Gaikwad', disposalMethod: 'Certified Chemical Neutralization', weightKg: 35, vendor: 'EnviroSafe Hazardous Handlers', status: 'In-Transit' },
];

const INITIAL_INSPECTIONS: HousekeepingInspection[] = [
  {
    id: 'insp-1',
    warehouseId: 'wh-001',
    inspectionDate: '2026-07-27',
    inspectorName: 'Priya Sundaram (Supervisor)',
    cleanlinessScore: 96,
    safetyScore: 98,
    hygieneScore: 95,
    remarks: 'Outstanding sanitation standards in Dock & Storage Zone A. All checklist tasks verified with before/after photos.',
    correctiveActions: 'Ensure parking sweeping sweeper truck completes run before 12:00 PM.',
    status: 'APPROVED',
  },
  {
    id: 'insp-2',
    warehouseId: 'wh-001',
    inspectionDate: '2026-07-20',
    inspectorName: 'Rajesh Sharma (Warehouse Manager)',
    cleanlinessScore: 94,
    safetyScore: 96,
    hygieneScore: 92,
    remarks: 'Weekly deep cleaning executed properly. Pest control bait stations verified intact.',
    correctiveActions: 'Refill hand wash dispensers in Block B prior to evening shift.',
    status: 'APPROVED',
  },
];

export const useHousekeepingStore = create<HousekeepingState>()(
  persist(
    (set) => ({
      staff: INITIAL_STAFF,
      areaStatuses: INITIAL_AREAS,
      tasks: INITIAL_TASKS,
      toiletLogs: INITIAL_TOILETS,
      garbageRecords: INITIAL_GARBAGE,
      inspections: INITIAL_INSPECTIONS,

      updateTaskStatus: (taskId, status, remarks) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  completionTime: status === 'Completed' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.completionTime,
                  remarks: remarks || t.remarks,
                }
              : t
          ),
        }));
      },

      updateAreaStatus: (areaId, status, lastCleaned) => {
        set((state) => ({
          areaStatuses: state.areaStatuses.map((a) =>
            a.id === areaId
              ? {
                  ...a,
                  status,
                  lastCleaned: lastCleaned || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              : a
          ),
        }));
      },

      addInspection: (inspectionData) => {
        const newInsp: HousekeepingInspection = {
          ...inspectionData,
          id: `insp-${Date.now()}`,
        };
        set((state) => ({ inspections: [newInsp, ...state.inspections] }));
      },

      addGarbageRecord: (recordData) => {
        const newGarb: GarbageRecord = {
          ...recordData,
          id: `garb-${Date.now()}`,
        };
        set((state) => ({ garbageRecords: [newGarb, ...state.garbageRecords] }));
      },

      addStaff: (staffData) => {
        const newStaff: HousekeepingStaff = {
          ...staffData,
          id: `hs-${Date.now()}`,
        };
        set((state) => ({ staff: [newStaff, ...state.staff] }));
      },
    }),
    { name: 'sankaj-housekeeping-storage' }
  )
);
