export interface MockCompany {
  id: string;
  name: string;
  gstNumber: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  warehouseCount?: number;
  createdAt: string;
}

export interface MockWarehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  companyId: string;
  companyName?: string;
  managerId?: string;
  managerName?: string;
  capacity: number; // e.g. 50,000 units
  occupancy: number; // e.g. 78%
  area: number; // Sq Ft
  workingHours: string;
  rentalCost: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';
  createdAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAREHOUSE_MANAGER' | 'SUPERVISOR' | 'INVENTORY_EXECUTIVE' | 'PICKER' | 'PACKER' | 'VIEWER';
  companyId?: string;
  warehouseId?: string;
  warehouseName?: string;
  status: boolean;
  avatar: string;
  createdAt: string;
}

export interface MockAsset {
  id: string;
  assetCustomId: string; // AST-FORK-001
  name: string;
  category: string;
  barcode: string;
  qrCode: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  vendor: string;
  warrantyExpiry: string;
  warehouseId: string;
  warehouseName: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  condition: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DISPOSED';
  image: string;
  createdAt: string;
}

export interface MockInventoryItem {
  id: string;
  sku: string;
  barcode: string;
  qrCode: string;
  productName: string;
  category: string;
  brand: string;
  batchNumber: string;
  quantity: number;
  reserved: number;
  available: number;
  damaged: number;
  minStock: number;
  maxStock: number;
  warehouseId: string;
  warehouseName: string;
  rack: string;
  shelf: string;
  bin: string;
  supplier: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'DISCONTINUED';
  createdAt: string;
}

export interface MockWorkflowStep {
  id: string;
  stepName: string;
  stepOrder: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'ON_HOLD' | 'CANCELLED';
  employeeName: string;
  timestamp: string;
  remarks: string;
  progress: number; // 0 - 100
}

export interface MockInboundShipment {
  id: string;
  shipmentCode: string;
  supplierName: string;
  vehicleNumber: string;
  dockNumber: string;
  totalItems: number;
  warehouseId: string;
  warehouseName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'ON_HOLD';
  createdAt: string;
  steps: MockWorkflowStep[];
}

export interface MockOutboundOrder {
  id: string;
  orderCode: string;
  customer: string;
  invoiceNo: string;
  pickingType: 'Case' | 'Batch' | 'Loose' | 'Pallet' | 'Box';
  totalItems: number;
  warehouseId: string;
  warehouseName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'ON_HOLD';
  createdAt: string;
  steps: MockWorkflowStep[];
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ASSET_ASSIGNED' | 'LOW_STOCK' | 'INBOUND_COMPLETED' | 'OUTBOUND_COMPLETED' | 'USER_CREATED' | 'WAREHOUSE_CREATED';
  isRead: boolean;
  link: string;
  createdAt: string;
}

// Initial Mock Datasets
export const INITIAL_COMPANIES: MockCompany[] = [
  {
    id: 'comp-001',
    name: 'Sangkaj Enterprises Ltd.',
    gstNumber: '27AAACS1234F1Z5',
    address: 'Suite 401, Apex Financial Tower, BKC',
    phone: '+91 22 4918 2000',
    email: 'corp@sangkaj.com',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    status: 'ACTIVE',
    warehouseCount: 4,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'comp-002',
    name: 'Ennea Logistics Global',
    gstNumber: '07BBBCS5678G2Z9',
    address: 'Plot 88, Cyber City Phase 2',
    phone: '+91 124 400 9988',
    email: 'admin@ennealogistics.com',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=120&q=80',
    status: 'ACTIVE',
    warehouseCount: 2,
    createdAt: '2025-02-15T09:30:00Z',
  },
];

export const INITIAL_WAREHOUSES: MockWarehouse[] = [
  {
    id: 'wh-001',
    code: 'WH-MUM-01',
    name: 'Mumbai Central Mega Hub',
    address: 'Bhiwandi Logistics Zone, Bldg 4',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '421302',
    companyId: 'comp-001',
    companyName: 'Sangkaj Enterprises Ltd.',
    managerId: 'usr-003',
    managerName: 'Rajesh Sharma',
    capacity: 75000,
    occupancy: 82,
    area: 120000,
    workingHours: '24/7 Operations',
    rentalCost: 450000,
    status: 'ACTIVE',
    createdAt: '2025-01-15T11:00:00Z',
  },
  {
    id: 'wh-002',
    code: 'WH-DEL-02',
    name: 'Delhi North Logistics Park',
    address: 'Kundu Freight Hub, Sector 18',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    pinCode: '122015',
    companyId: 'comp-001',
    companyName: 'Sangkaj Enterprises Ltd.',
    managerId: 'usr-004',
    managerName: 'Vikram Malhotra',
    capacity: 50000,
    occupancy: 64,
    area: 85000,
    workingHours: '06:00 AM - 10:00 PM',
    rentalCost: 320000,
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'wh-003',
    code: 'WH-BLR-03',
    name: 'Bangalore Tech Park Depot',
    address: 'Peenya Industrial Area Stage 3',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pinCode: '560058',
    companyId: 'comp-001',
    companyName: 'Sangkaj Enterprises Ltd.',
    managerId: 'usr-005',
    managerName: 'Ananya Rao',
    capacity: 40000,
    occupancy: 91,
    area: 60000,
    workingHours: '08:00 AM - 08:00 PM',
    rentalCost: 280000,
    status: 'ACTIVE',
    createdAt: '2025-02-20T14:15:00Z',
  },
  {
    id: 'wh-004',
    code: 'WH-HYD-04',
    name: 'Hyderabad Gateway Depot',
    address: 'Gachibowli Outer Logistics Ring',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pinCode: '500032',
    companyId: 'comp-002',
    companyName: 'Ennea Logistics Global',
    managerId: 'usr-006',
    managerName: 'Karthik Reddy',
    capacity: 35000,
    occupancy: 45,
    area: 50000,
    workingHours: '08:00 AM - 08:00 PM',
    rentalCost: 210000,
    status: 'ACTIVE',
    createdAt: '2025-03-05T10:00:00Z',
  },
];

export const INITIAL_USERS: MockUser[] = [
  {
    id: 'usr-001',
    name: 'Super Admin User',
    email: 'admin@ennea.com',
    phone: '+91 98765 43210',
    role: 'SUPER_ADMIN',
    companyId: 'comp-001',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Deepak Sangkaj',
    email: 'deepak@sangkaj.com',
    phone: '+91 99887 76655',
    role: 'COMPANY_ADMIN',
    companyId: 'comp-001',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'usr-003',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@sangkaj.com',
    phone: '+91 91234 56789',
    role: 'WAREHOUSE_MANAGER',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-01-15T11:00:00Z',
  },
  {
    id: 'usr-004',
    name: 'Priya Sundaram',
    email: 'priya.s@sangkaj.com',
    phone: '+91 94567 89012',
    role: 'SUPERVISOR',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'usr-005',
    name: 'Amitabh Verma',
    email: 'amit.verma@sangkaj.com',
    phone: '+91 97890 12345',
    role: 'INVENTORY_EXECUTIVE',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-02-01T12:00:00Z',
  },
  {
    id: 'usr-006',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@sangkaj.com',
    phone: '+91 93210 98765',
    role: 'PICKER',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-02-10T14:00:00Z',
  },
  {
    id: 'usr-007',
    name: 'Suresh Patil',
    email: 'suresh.p@sangkaj.com',
    phone: '+91 96543 21098',
    role: 'PACKER',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-02-12T15:30:00Z',
  },
  {
    id: 'usr-008',
    name: 'Audit Viewer',
    email: 'viewer@ennea.com',
    phone: '+91 90000 11111',
    role: 'VIEWER',
    companyId: 'comp-001',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-02-15T16:00:00Z',
  },
];

export const INITIAL_ASSETS: MockAsset[] = [
  {
    id: 'ast-001',
    assetCustomId: 'AST-FORK-001',
    name: 'Toyota 3-Ton Heavy Forklift 8FGU25',
    category: 'Forklift',
    barcode: 'BC-AST-882101',
    qrCode: 'QR-AST-FORK-001',
    serialNumber: 'SN-TYT-90412-MUM',
    purchaseDate: '2024-03-15',
    purchaseCost: 2850000,
    vendor: 'Toyota Material Handling India',
    warrantyExpiry: '2027-03-15',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    assignedEmployeeId: 'usr-004',
    assignedEmployeeName: 'Priya Sundaram',
    condition: 'IN_USE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-15T12:00:00Z',
  },
  {
    id: 'ast-002',
    assetCustomId: 'AST-SCN-104',
    name: 'Zebra TC52 Industrial Android Barcode Scanner',
    category: 'Scanner',
    barcode: 'BC-AST-773012',
    qrCode: 'QR-AST-SCN-104',
    serialNumber: 'ZBR-TC52-44091',
    purchaseDate: '2024-06-10',
    purchaseCost: 75000,
    vendor: 'Zebra Technologies Corp',
    warrantyExpiry: '2026-06-10',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    assignedEmployeeId: 'usr-006',
    assignedEmployeeName: 'Rohan Deshmukh',
    condition: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-18T10:30:00Z',
  },
  {
    id: 'ast-003',
    assetCustomId: 'AST-PRN-055',
    name: 'Zebra ZT411 Industrial Thermal Label Printer',
    category: 'Printer',
    barcode: 'BC-AST-664099',
    qrCode: 'QR-AST-PRN-055',
    serialNumber: 'SN-ZBR-ZT411-88',
    purchaseDate: '2024-08-20',
    purchaseCost: 145000,
    vendor: 'PrintTech Solutions India',
    warrantyExpiry: '2026-08-20',
    warehouseId: 'wh-002',
    warehouseName: 'Delhi North Logistics Park',
    assignedEmployeeId: 'usr-007',
    assignedEmployeeName: 'Suresh Patil',
    condition: 'IN_USE',
    image: 'https://images.unsplash.com/photo-1612815150548-9968a3562479?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-20T11:45:00Z',
  },
  {
    id: 'ast-004',
    assetCustomId: 'AST-LAP-901',
    name: 'Dell Precision 7680 Workstation i9 64GB',
    category: 'Laptop',
    barcode: 'BC-AST-110293',
    qrCode: 'QR-AST-LAP-901',
    serialNumber: 'DELL-PR76-MUM-01',
    purchaseDate: '2024-11-05',
    purchaseCost: 220000,
    vendor: 'Dell India Enterprise',
    warrantyExpiry: '2027-11-05',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    assignedEmployeeId: 'usr-003',
    assignedEmployeeName: 'Rajesh Sharma',
    condition: 'IN_USE',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-25T08:20:00Z',
  },
  {
    id: 'ast-005',
    assetCustomId: 'AST-GEN-302',
    name: 'Caterpillar 250 kVA Silent Diesel Generator',
    category: 'Generator',
    barcode: 'BC-AST-993810',
    qrCode: 'QR-AST-GEN-302',
    serialNumber: 'CAT-GEN-250-HYD',
    purchaseDate: '2023-05-12',
    purchaseCost: 1850000,
    vendor: 'GMMCO Caterpillar India',
    warrantyExpiry: '2026-05-12',
    warehouseId: 'wh-004',
    warehouseName: 'Hyderabad Gateway Depot',
    condition: 'MAINTENANCE',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-02-01T09:15:00Z',
  },
];

export const INITIAL_INVENTORY: MockInventoryItem[] = [
  {
    id: 'inv-001',
    sku: 'SKU-EPK-1002',
    barcode: '890123456701',
    qrCode: 'QR-INV-EPK-1002',
    productName: 'Heavy Duty Pallet Stretch Wrap 500mm',
    category: 'Packaging Materials',
    brand: 'PackShield Enterprise',
    batchNumber: 'BATCH-2026-A1',
    quantity: 1450,
    reserved: 200,
    available: 1250,
    damaged: 0,
    minStock: 250,
    maxStock: 3000,
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    rack: 'R-04',
    shelf: 'S-02',
    bin: 'B-12',
    supplier: 'Supreme Polymers Ltd.',
    status: 'IN_STOCK',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'inv-002',
    sku: 'SKU-AST-3041',
    barcode: '890123456702',
    qrCode: 'QR-INV-AST-3041',
    productName: 'Industrial Thermal Transfer Labels 4x6 Roll',
    category: 'Labeling & Signage',
    brand: 'Zebra Media',
    batchNumber: 'BATCH-2026-B8',
    quantity: 120,
    reserved: 50,
    available: 70,
    damaged: 0,
    minStock: 200,
    maxStock: 2000,
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    rack: 'R-01',
    shelf: 'S-05',
    bin: 'B-01',
    supplier: 'Zebra India',
    status: 'LOW_STOCK',
    createdAt: '2025-01-12T14:30:00Z',
  },
  {
    id: 'inv-003',
    sku: 'SKU-PLT-5099',
    barcode: '890123456703',
    qrCode: 'QR-INV-PLT-5099',
    productName: 'Standard EURO Wooden Pallet 1200x800mm',
    category: 'Storage Media',
    brand: 'Chep Logistics',
    batchNumber: 'BATCH-2025-Z9',
    quantity: 680,
    reserved: 120,
    available: 550,
    damaged: 10,
    minStock: 100,
    maxStock: 1500,
    warehouseId: 'wh-002',
    warehouseName: 'Delhi North Logistics Park',
    rack: 'R-10',
    shelf: 'S-01',
    bin: 'B-08',
    supplier: 'Chep India Ltd.',
    status: 'IN_STOCK',
    createdAt: '2025-01-15T09:20:00Z',
  },
  {
    id: 'inv-004',
    sku: 'SKU-RFD-8840',
    barcode: '890123456704',
    qrCode: 'QR-INV-RFD-8840',
    productName: 'UHF RFID Smart Inventory Tags (Pack of 500)',
    category: 'Electronics',
    brand: 'Impinj Monza',
    batchNumber: 'BATCH-2026-R4',
    quantity: 45,
    reserved: 10,
    available: 35,
    damaged: 0,
    minStock: 100,
    maxStock: 500,
    warehouseId: 'wh-003',
    warehouseName: 'Bangalore Tech Park Depot',
    rack: 'R-02',
    shelf: 'S-03',
    bin: 'B-04',
    supplier: 'Impinj Asia Pacific',
    status: 'LOW_STOCK',
    createdAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'inv-005',
    sku: 'SKU-LBR-7711',
    barcode: '890123456705',
    qrCode: 'QR-INV-LBR-7711',
    productName: 'Hydraulic Oil ISO VG 46 (200L Drum)',
    category: 'Maintenance Supplies',
    brand: 'Castrol Hyspin',
    batchNumber: 'BATCH-2025-C3',
    quantity: 12,
    reserved: 2,
    available: 10,
    damaged: 0,
    minStock: 5,
    maxStock: 50,
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    rack: 'R-15',
    shelf: 'S-01',
    bin: 'B-01',
    supplier: 'Castrol Lubricants India',
    status: 'IN_STOCK',
    createdAt: '2025-02-10T16:45:00Z',
  },
];

export const INITIAL_INBOUND: MockInboundShipment[] = [
  {
    id: 'inb-001',
    shipmentCode: 'INB-2026-001',
    supplierName: 'Tata International Logistics',
    vehicleNumber: 'MH-04-JK-9941',
    dockNumber: 'Dock 04',
    totalItems: 850,
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: 'IN_PROGRESS',
    createdAt: '2026-07-24T06:30:00Z',
    steps: [
      {
        id: 'step-inb-1',
        stepName: 'Vehicle Reporting',
        stepOrder: 1,
        status: 'COMPLETED',
        employeeName: 'Rohan Deshmukh',
        timestamp: '2026-07-24 06:45 AM',
        remarks: 'Vehicle reported at main gate security. Documents verified.',
        progress: 100,
      },
      {
        id: 'step-inb-2',
        stepName: 'Dock Allocation',
        stepOrder: 2,
        status: 'COMPLETED',
        employeeName: 'Priya Sundaram',
        timestamp: '2026-07-24 07:05 AM',
        remarks: 'Assigned Bay Dock 04. Ramp lowered.',
        progress: 100,
      },
      {
        id: 'step-inb-3',
        stepName: 'Unload',
        stepOrder: 3,
        status: 'COMPLETED',
        employeeName: 'Suresh Patil',
        timestamp: '2026-07-24 07:45 AM',
        remarks: '18 Pallets unloaded safely using Toyota Forklift #01.',
        progress: 100,
      },
      {
        id: 'step-inb-4',
        stepName: 'Inspection',
        stepOrder: 4,
        status: 'COMPLETED',
        employeeName: 'Amitabh Verma',
        timestamp: '2026-07-24 08:30 AM',
        remarks: 'Visual damage check passed. No broken seal alerts.',
        progress: 100,
      },
      {
        id: 'step-inb-5',
        stepName: 'Counting',
        stepOrder: 5,
        status: 'COMPLETED',
        employeeName: 'Amitabh Verma',
        timestamp: '2026-07-24 09:15 AM',
        remarks: '850 units counted with handheld Zebra TC52 barcode scanner.',
        progress: 100,
      },
      {
        id: 'step-inb-6',
        stepName: 'GRN Generation',
        stepOrder: 6,
        status: 'COMPLETED',
        employeeName: 'Rajesh Sharma',
        timestamp: '2026-07-24 09:40 AM',
        remarks: 'Goods Receipt Note #GRN-9941 generated in SAP bridge.',
        progress: 100,
      },
      {
        id: 'step-inb-7',
        stepName: 'Staging',
        stepOrder: 7,
        status: 'IN_PROGRESS',
        employeeName: 'Rohan Deshmukh',
        timestamp: '2026-07-24 10:10 AM',
        remarks: 'Moved to Inbound Staging Zone B for Put-Away binning.',
        progress: 65,
      },
      {
        id: 'step-inb-8',
        stepName: 'Put Away',
        stepOrder: 8,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Pending rack assignment.',
        progress: 0,
      },
      {
        id: 'step-inb-9',
        stepName: 'Completed',
        stepOrder: 9,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Final signoff pending.',
        progress: 0,
      },
    ],
  },
  {
    id: 'inb-002',
    shipmentCode: 'INB-2026-002',
    supplierName: 'Reliance Industrial Supplies',
    vehicleNumber: 'DL-01-AX-1102',
    dockNumber: 'Dock 02',
    totalItems: 1200,
    warehouseId: 'wh-002',
    warehouseName: 'Delhi North Logistics Park',
    status: 'COMPLETED',
    createdAt: '2026-07-23T08:00:00Z',
    steps: [
      {
        id: 'step-inb-201',
        stepName: 'Vehicle Reporting',
        stepOrder: 1,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 08:15 AM',
        remarks: 'Vehicle cleared at gate.',
        progress: 100,
      },
      {
        id: 'step-inb-202',
        stepName: 'Dock Allocation',
        stepOrder: 2,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 08:30 AM',
        remarks: 'Dock 02 allocated.',
        progress: 100,
      },
      {
        id: 'step-inb-203',
        stepName: 'Unload',
        stepOrder: 3,
        status: 'COMPLETED',
        employeeName: 'Delhi Team',
        timestamp: '2026-07-23 09:15 AM',
        remarks: 'Unloaded 24 pallets.',
        progress: 100,
      },
      {
        id: 'step-inb-204',
        stepName: 'Inspection',
        stepOrder: 4,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 09:45 AM',
        remarks: 'QC inspection cleared.',
        progress: 100,
      },
      {
        id: 'step-inb-205',
        stepName: 'Counting',
        stepOrder: 5,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 10:15 AM',
        remarks: '1200 items matched against PO.',
        progress: 100,
      },
      {
        id: 'step-inb-206',
        stepName: 'GRN Generation',
        stepOrder: 6,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 10:30 AM',
        remarks: 'GRN #7710 created.',
        progress: 100,
      },
      {
        id: 'step-inb-207',
        stepName: 'Staging',
        stepOrder: 7,
        status: 'COMPLETED',
        employeeName: 'Delhi Team',
        timestamp: '2026-07-23 11:00 AM',
        remarks: 'Staging complete.',
        progress: 100,
      },
      {
        id: 'step-inb-208',
        stepName: 'Put Away',
        stepOrder: 8,
        status: 'COMPLETED',
        employeeName: 'Delhi Team',
        timestamp: '2026-07-23 12:30 PM',
        remarks: 'Binned in Rack 10, Shelf 01.',
        progress: 100,
      },
      {
        id: 'step-inb-209',
        stepName: 'Completed',
        stepOrder: 9,
        status: 'COMPLETED',
        employeeName: 'Vikram Malhotra',
        timestamp: '2026-07-23 01:00 PM',
        remarks: 'Inbound process finished successfully.',
        progress: 100,
      },
    ],
  },
];

export const INITIAL_OUTBOUND: MockOutboundOrder[] = [
  {
    id: 'out-001',
    orderCode: 'OUT-2026-001',
    customer: 'Mahindra Auto Parts Division',
    invoiceNo: 'INV-SNK-9901',
    pickingType: 'Pallet',
    totalItems: 450,
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    status: 'IN_PROGRESS',
    createdAt: '2026-07-24T07:15:00Z',
    steps: [
      {
        id: 'step-out-1',
        stepName: 'Invoice & Order Created',
        stepOrder: 1,
        status: 'COMPLETED',
        employeeName: 'Deepak Sangkaj',
        timestamp: '2026-07-24 07:20 AM',
        remarks: 'Sales Invoice INV-SNK-9901 verified & authorized.',
        progress: 100,
      },
      {
        id: 'step-out-2',
        stepName: 'Picking',
        stepOrder: 2,
        status: 'COMPLETED',
        employeeName: 'Rohan Deshmukh',
        timestamp: '2026-07-24 08:00 AM',
        remarks: 'Pallet picking finished in Aisle 04.',
        progress: 100,
      },
      {
        id: 'step-out-3',
        stepName: 'Packing',
        stepOrder: 3,
        status: 'IN_PROGRESS',
        employeeName: 'Suresh Patil',
        timestamp: '2026-07-24 08:45 AM',
        remarks: 'Shrink wrapping and corner protection application.',
        progress: 80,
      },
      {
        id: 'step-out-4',
        stepName: 'Staging',
        stepOrder: 4,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Pending move to Outbound Dock 01.',
        progress: 0,
      },
      {
        id: 'step-out-5',
        stepName: 'Gate Pass',
        stepOrder: 5,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Security gate clearance pending.',
        progress: 0,
      },
      {
        id: 'step-out-6',
        stepName: 'Dispatch',
        stepOrder: 6,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Transporter truck assignment pending.',
        progress: 0,
      },
      {
        id: 'step-out-7',
        stepName: 'Completed',
        stepOrder: 7,
        status: 'PENDING',
        employeeName: 'Unassigned',
        timestamp: 'Pending',
        remarks: 'Order dispatch pending.',
        progress: 0,
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'notif-001',
    userId: 'usr-001',
    title: 'Low Stock Alert',
    message: 'SKU-AST-3041 (Thermal Labels) quantity drop to 120 (Min: 200).',
    type: 'LOW_STOCK',
    isRead: false,
    link: '/dashboard/inventory',
    createdAt: '10 mins ago',
  },
  {
    id: 'notif-002',
    userId: 'usr-001',
    title: 'Inbound GRN Generated',
    message: 'Inbound shipment INB-2026-001 GRN generated by Rajesh Sharma.',
    type: 'INBOUND_COMPLETED',
    isRead: false,
    link: '/dashboard/inbound',
    createdAt: '45 mins ago',
  },
  {
    id: 'notif-003',
    userId: 'usr-001',
    title: 'Asset Assigned',
    message: 'Toyota Forklift AST-FORK-001 assigned to Priya Sundaram.',
    type: 'ASSET_ASSIGNED',
    isRead: true,
    link: '/dashboard/assets',
    createdAt: '2 hours ago',
  },
  {
    id: 'notif-004',
    userId: 'usr-001',
    title: 'New Warehouse Added',
    message: 'Hyderabad Gateway Depot (WH-HYD-04) created successfully.',
    type: 'WAREHOUSE_CREATED',
    isRead: true,
    link: '/dashboard/warehouses',
    createdAt: '1 day ago',
  },
];
