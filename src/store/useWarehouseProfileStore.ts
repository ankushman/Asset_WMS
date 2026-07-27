import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WarehouseEmployee {
  id: string;
  warehouseId: string;
  employeeId: string;
  name: string;
  type: 'WHITE_COLLAR' | 'BLUE_COLLAR';
  designation: string;
  department: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE';
  phone: string;
  email: string;
  experience: string;
  joiningDate: string;
  assignedZone?: string;
  currentTask?: string;
  skillLevel?: 'Level 1' | 'Level 2' | 'Level 3' | 'Master Operator';
  employmentType: 'Permanent' | 'Contract' | 'Temporary';
}

export interface WarehouseDocument {
  id: string;
  warehouseId: string;
  fileName: string;
  category:
    | 'Warehouse Registration'
    | 'Lease Agreement'
    | 'Insurance'
    | 'GST'
    | 'Fire NOC'
    | 'Factory License'
    | 'ISO Certificates'
    | 'Audit Reports'
    | 'Warehouse Layout Drawings'
    | 'Safety SOPs'
    | 'Vendor Contracts'
    | 'Equipment Manuals'
    | 'Images'
    | 'Videos'
    | 'Other Documents';
  uploadedBy: string;
  uploadDate: string;
  version: string;
  size: string;
  fileUrl: string;
}

export interface WarehouseActivityLog {
  id: string;
  warehouseId: string;
  timestamp: string;
  user: string;
  role: string;
  category:
    | 'Warehouse Created'
    | 'Document Uploaded'
    | 'Employee Added'
    | 'Asset Added'
    | 'Inventory Updated'
    | 'Inbound Received'
    | 'Outbound Dispatched'
    | 'Maintenance Completed'
    | 'User Login'
    | 'Settings Updated';
  details: string;
  ipAddress: string;
}

interface WarehouseProfileState {
  employees: WarehouseEmployee[];
  documents: WarehouseDocument[];
  activityLogs: WarehouseActivityLog[];
  addEmployee: (emp: Omit<WarehouseEmployee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
  addDocument: (doc: Omit<WarehouseDocument, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;
  replaceDocument: (id: string, newDoc: Partial<WarehouseDocument>) => void;
  addActivityLog: (log: Omit<WarehouseActivityLog, 'id' | 'timestamp'>) => void;
}

const INITIAL_EMPLOYEES: WarehouseEmployee[] = [
  // WH-MUM-01 White Collar
  {
    id: 'emp-001',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-101',
    name: 'Rajesh Sharma',
    type: 'WHITE_COLLAR',
    designation: 'Warehouse General Manager',
    department: 'Operations',
    role: 'Warehouse Manager',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 91234 56789',
    email: 'rajesh.sharma@sankajlogistics.com',
    experience: '12 Years',
    joiningDate: '2018-04-15',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-002',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-102',
    name: 'Priya Sundaram',
    type: 'WHITE_COLLAR',
    designation: 'Senior Shift Supervisor',
    department: 'Floor Supervision',
    role: 'Supervisor',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 94567 89012',
    email: 'priya.s@sankajlogistics.com',
    experience: '7 Years',
    joiningDate: '2020-02-10',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-003',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-103',
    name: 'Amitabh Verma',
    type: 'WHITE_COLLAR',
    designation: 'Lead Inventory Controller',
    department: 'Inventory Management',
    role: 'Inventory Executive',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 97890 12345',
    email: 'amit.verma@sankajlogistics.com',
    experience: '6 Years',
    joiningDate: '2021-08-01',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-004',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-104',
    name: 'Kavita Nair',
    type: 'WHITE_COLLAR',
    designation: 'Quality Assurance Inspector',
    department: 'Quality & Safety',
    role: 'Quality Inspector',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 98765 11223',
    email: 'kavita.n@sankajlogistics.com',
    experience: '5 Years',
    joiningDate: '2022-01-15',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-005',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-105',
    name: 'Siddharth Roy',
    type: 'WHITE_COLLAR',
    designation: 'Site Systems Administrator',
    department: 'IT Support',
    role: 'IT Support',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 91122 33445',
    email: 'siddharth.r@sankajlogistics.com',
    experience: '4 Years',
    joiningDate: '2023-03-20',
    employmentType: 'Permanent',
  },

  // WH-MUM-01 Blue Collar
  {
    id: 'emp-006',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-201',
    name: 'Rohan Deshmukh',
    type: 'BLUE_COLLAR',
    designation: 'High-Bay Forklift Operator',
    department: 'Material Handling',
    role: 'Forklift Operator',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 93210 98765',
    email: 'rohan.d@sankajlogistics.com',
    experience: '5 Years',
    joiningDate: '2021-05-10',
    assignedZone: 'Zone A - Heavy Rack',
    currentTask: 'High-Rack Staging',
    skillLevel: 'Master Operator',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-007',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-202',
    name: 'Suresh Patil',
    type: 'BLUE_COLLAR',
    designation: 'Senior Export Packer',
    department: 'Outbound Packing',
    role: 'Packer',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 96543 21098',
    email: 'suresh.p@sankajlogistics.com',
    experience: '4 Years',
    joiningDate: '2022-06-12',
    assignedZone: 'Zone C - Packing Bay 4',
    currentTask: 'Pallet Stretch Wrapping',
    skillLevel: 'Level 3',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-008',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-203',
    name: 'Ganesh Shinde',
    type: 'BLUE_COLLAR',
    designation: 'Inbound Dock Loader',
    department: 'Inbound Dock',
    role: 'Loader',
    shift: 'Morning',
    attendanceStatus: 'PRESENT',
    phone: '+91 98220 44556',
    email: 'ganesh.s@sankajlogistics.com',
    experience: '3 Years',
    joiningDate: '2023-01-10',
    assignedZone: 'Dock 04',
    currentTask: 'Unloading Container TRK-881',
    skillLevel: 'Level 2',
    employmentType: 'Contract',
  },
  {
    id: 'emp-009',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-204',
    name: 'Vijay Kumar',
    type: 'BLUE_COLLAR',
    designation: 'Heavy Vehicle Yard Driver',
    department: 'Transportation',
    role: 'Driver',
    shift: 'Evening',
    attendanceStatus: 'PRESENT',
    phone: '+91 97654 33221',
    email: 'vijay.k@sankajlogistics.com',
    experience: '8 Years',
    joiningDate: '2019-11-05',
    assignedZone: 'Gate 2 Yard',
    currentTask: 'Shunting Trailer 09',
    skillLevel: 'Master Operator',
    employmentType: 'Permanent',
  },
  {
    id: 'emp-010',
    warehouseId: 'wh-001',
    employeeId: 'EMP-MUM-205',
    name: 'Mahesh Jadhav',
    type: 'BLUE_COLLAR',
    designation: 'Gate Security Supervisor',
    department: 'Security',
    role: 'Security Guard',
    shift: 'Night',
    attendanceStatus: 'PRESENT',
    phone: '+91 99881 12233',
    email: 'mahesh.j@sankajlogistics.com',
    experience: '6 Years',
    joiningDate: '2020-07-15',
    assignedZone: 'Main Entry Gate',
    currentTask: 'Vehicle Gate Pass Audit',
    skillLevel: 'Level 3',
    employmentType: 'Contract',
  },
];

const INITIAL_DOCUMENTS: WarehouseDocument[] = [
  {
    id: 'doc-101',
    warehouseId: 'wh-001',
    fileName: 'WH-MUM-01_Registration_Certificate_2026.pdf',
    category: 'Warehouse Registration',
    uploadedBy: 'Rajesh Sharma',
    uploadDate: '2026-01-15',
    version: 'v2.1',
    size: '2.4 MB',
    fileUrl: '#',
  },
  {
    id: 'doc-102',
    warehouseId: 'wh-001',
    fileName: 'Lease_Agreement_BKC_Logistics_Park.pdf',
    category: 'Lease Agreement',
    uploadedBy: 'Deepak Sankaj',
    uploadDate: '2025-12-01',
    version: 'v1.0',
    size: '4.8 MB',
    fileUrl: '#',
  },
  {
    id: 'doc-103',
    warehouseId: 'wh-001',
    fileName: 'Fire_NOC_Certificate_Bhiwandi_2026.pdf',
    category: 'Fire NOC',
    uploadedBy: 'Rajesh Sharma',
    uploadDate: '2026-02-10',
    version: 'v1.2',
    size: '1.8 MB',
    fileUrl: '#',
  },
  {
    id: 'doc-104',
    warehouseId: 'wh-001',
    fileName: 'Warehouse_Master_Layout_Blueprint_3D.dwg',
    category: 'Warehouse Layout Drawings',
    uploadedBy: 'Priya Sundaram',
    uploadDate: '2026-03-05',
    version: 'v3.0',
    size: '12.5 MB',
    fileUrl: '#',
  },
  {
    id: 'doc-105',
    warehouseId: 'wh-001',
    fileName: 'ISO_9001_2015_Quality_Audit_Report.pdf',
    category: 'ISO Certificates',
    uploadedBy: 'Super Admin User',
    uploadDate: '2026-04-18',
    version: 'v1.0',
    size: '3.1 MB',
    fileUrl: '#',
  },
  {
    id: 'doc-106',
    warehouseId: 'wh-001',
    fileName: 'Industrial_Safety_SOP_Manual_2026.pdf',
    category: 'Safety SOPs',
    uploadedBy: 'Kavita Nair',
    uploadDate: '2026-05-02',
    version: 'v2.0',
    size: '5.2 MB',
    fileUrl: '#',
  },
];

const INITIAL_LOGS: WarehouseActivityLog[] = [
  {
    id: 'log-101',
    warehouseId: 'wh-001',
    timestamp: '2026-07-27 09:30:15 AM',
    user: 'Rajesh Sharma',
    role: 'Warehouse Manager',
    category: 'Document Uploaded',
    details: 'Uploaded updated Fire NOC Renewal Certificate (v1.2)',
    ipAddress: '192.168.1.140',
  },
  {
    id: 'log-102',
    warehouseId: 'wh-001',
    timestamp: '2026-07-27 08:15:00 AM',
    user: 'Priya Sundaram',
    role: 'Supervisor',
    category: 'Inbound Received',
    details: 'Received Inbound Shipment INB-2026-001 from Tata International (850 Units)',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'log-103',
    warehouseId: 'wh-001',
    timestamp: '2026-07-26 05:45:22 PM',
    user: 'Rohan Deshmukh',
    role: 'Forklift Operator',
    category: 'Inventory Updated',
    details: 'Completed Put-Away for 300 Pallets of Hydraulic Fluid in Zone A-Rack 04',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'log-104',
    warehouseId: 'wh-001',
    timestamp: '2026-07-26 02:20:10 PM',
    user: 'Super Admin User',
    role: 'Super Admin',
    category: 'Employee Added',
    details: 'Assigned Siddharth Roy as Site Systems Administrator for IT Support',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'log-105',
    warehouseId: 'wh-001',
    timestamp: '2026-07-25 11:00:00 AM',
    user: 'Rajesh Sharma',
    role: 'Warehouse Manager',
    category: 'Maintenance Completed',
    details: 'Scheduled battery maintenance check for Jungheinrich Reach Truck MHE-RT-01',
    ipAddress: '192.168.1.140',
  },
];

export const useWarehouseProfileStore = create<WarehouseProfileState>()(
  persist(
    (set) => ({
      employees: INITIAL_EMPLOYEES,
      documents: INITIAL_DOCUMENTS,
      activityLogs: INITIAL_LOGS,

      addEmployee: (empData) => {
        const newEmp: WarehouseEmployee = {
          ...empData,
          id: `emp-${Date.now()}`,
        };
        set((state) => ({ employees: [newEmp, ...state.employees] }));
      },

      deleteEmployee: (id) => {
        set((state) => ({ employees: state.employees.filter((e) => e.id !== id) }));
      },

      addDocument: (docData) => {
        const newDoc: WarehouseDocument = {
          ...docData,
          id: `doc-${Date.now()}`,
          uploadDate: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ documents: [newDoc, ...state.documents] }));
      },

      deleteDocument: (id) => {
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }));
      },

      replaceDocument: (id, newDoc) => {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...newDoc } : d)),
        }));
      },

      addActivityLog: (logData) => {
        const newLog: WarehouseActivityLog = {
          ...logData,
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
        };
        set((state) => ({ activityLogs: [newLog, ...state.activityLogs] }));
      },
    }),
    { name: 'sankaj-warehouse-profile-storage' }
  )
);
