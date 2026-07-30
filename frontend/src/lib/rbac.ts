export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'ASSET_MANAGER'
  | 'INBOUND_SUPERVISOR'
  | 'OUTBOUND_SUPERVISOR'
  | 'TRANSPORTATION_MANAGER'
  | 'WAREHOUSE_OPERATOR'
  | 'FORKLIFT_OPERATOR'
  | 'PICKER'
  | 'PACKER'
  | 'LOADER'
  | 'SECURITY_OFFICER'
  | 'FINANCE'
  | 'HR'
  | 'AUDITOR'
  | 'SUPERVISOR'
  | 'INVENTORY_EXECUTIVE'
  | 'VIEWER';

export interface PermissionDefinition {
  code: string;
  name: string;
  module: string;
  description: string;
}

export interface PermissionGroup {
  module: string;
  moduleName: string;
  permissions: PermissionDefinition[];
}

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  requiredPermission?: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Dashboard & AI
  { code: 'dashboard.view', name: 'View Executive Dashboard', module: 'Dashboard', description: 'Access overview dashboard and KPIs' },
  { code: 'ai.view', name: 'View AI Command Center', module: 'Dashboard', description: 'Access AI insights and predictive analytics' },

  // Warehouses
  { code: 'warehouse.view', name: 'View Warehouses', module: 'Warehouses', description: 'View warehouse list and details' },
  { code: 'warehouse.create', name: 'Create Warehouse', module: 'Warehouses', description: 'Register new warehouse facilities' },
  { code: 'warehouse.edit', name: 'Edit Warehouse', module: 'Warehouses', description: 'Update warehouse capacities and parameters' },
  { code: 'warehouse.delete', name: 'Delete Warehouse', module: 'Warehouses', description: 'Decommission warehouse facilities' },

  // Inventory
  { code: 'inventory.view', name: 'View Inventory Catalog', module: 'Inventory', description: 'Search and inspect stock items' },
  { code: 'inventory.create', name: 'Create SKU / Item', module: 'Inventory', description: 'Add new inventory SKU items' },
  { code: 'inventory.edit', name: 'Edit Inventory Items', module: 'Inventory', description: 'Modify SKU metadata and thresholds' },
  { code: 'inventory.delete', name: 'Delete SKU Item', module: 'Inventory', description: 'Remove SKU from inventory catalog' },
  { code: 'inventory.adjust', name: 'Stock Adjustment', module: 'Inventory', description: 'Perform manual stock count adjustments' },

  // Assets
  { code: 'asset.view', name: 'View Asset Catalog', module: 'Assets', description: 'View machinery, equipment and IT assets' },
  { code: 'asset.create', name: 'Register Asset', module: 'Assets', description: 'Add new capital equipment or asset' },
  { code: 'asset.edit', name: 'Edit Asset Details', module: 'Assets', description: 'Modify asset attributes and warranty' },
  { code: 'asset.delete', name: 'Delete Asset', module: 'Assets', description: 'Dispose or remove asset records' },
  { code: 'asset.assign', name: 'Assign Asset', module: 'Assets', description: 'Assign equipment to employees' },

  // Inbound
  { code: 'inbound.view', name: 'View Inbound Shipments', module: 'Inbound', description: 'Monitor dock receiving pipelines' },
  { code: 'inbound.create', name: 'Create Inbound Shipment', module: 'Inbound', description: 'Register new inbound receiving shipment' },
  { code: 'inbound.edit', name: 'Edit Inbound Steps', module: 'Inbound', description: 'Update vehicle, GRN, and put-away progress' },
  { code: 'inbound.approve', name: 'Approve Goods Receipt (GRN)', module: 'Inbound', description: 'Finalize GRN and stock ingestion' },

  // Outbound
  { code: 'outbound.view', name: 'View Outbound Orders', module: 'Outbound', description: 'Monitor picking, packing, and dispatch' },
  { code: 'outbound.create', name: 'Create Outbound Order', module: 'Outbound', description: 'Initiate new customer dispatch order' },
  { code: 'outbound.edit', name: 'Edit Outbound Order', module: 'Outbound', description: 'Update picking list and packing status' },
  { code: 'outbound.approve', name: 'Approve Dispatch Order', module: 'Outbound', description: 'Finalize order for vehicle loading' },

  // Gate Pass
  { code: 'gatepass.view', name: 'View Gate Pass Console', module: 'Gate Pass', description: 'View vehicle entry/exit gate passes' },
  { code: 'gatepass.print', name: 'Print Gate Pass Document', module: 'Gate Pass', description: 'Generate formatted A4 PDF Gate Pass' },
  { code: 'gatepass.approve', name: 'Approve Security Exit', module: 'Gate Pass', description: 'Authorize vehicle gate-out clearance' },

  // Transportation
  { code: 'transport.view', name: 'View Transportation (TMS)', module: 'Transportation', description: 'View delivery trips, vehicles & drivers' },
  { code: 'transport.create', name: 'Schedule Delivery Trip', module: 'Transportation', description: 'Create new delivery trip route' },
  { code: 'transport.edit', name: 'Edit Trip Details', module: 'Transportation', description: 'Modify vehicle allocation and driver details' },

  // Reports
  { code: 'report.view', name: 'View BI Reports', module: 'Reports', description: 'View executive analytics and charts' },
  { code: 'report.export', name: 'Export Reports (PDF/Excel)', module: 'Reports', description: 'Download PDF/Excel reports' },

  // Employees & Users
  { code: 'employee.view', name: 'View Employee Directory', module: 'Employees', description: 'View corporate employee directory' },
  { code: 'employee.create', name: 'Invite Employee', module: 'Employees', description: 'Send employee invitation links' },
  { code: 'employee.edit', name: 'Edit Employee Profile', module: 'Employees', description: 'Update employee designation and department' },
  { code: 'employee.delete', name: 'Delete Employee', module: 'Employees', description: 'Remove employee records' },

  // Company Management
  { code: 'company.view', name: 'View Company Profile', module: 'Company', description: 'View workspace settings and details' },
  { code: 'company.edit', name: 'Edit Company Profile', module: 'Company', description: 'Modify legal details, logo, address' },

  // Roles & Permissions
  { code: 'role.view', name: 'View Roles & Permissions', module: 'Roles', description: 'View RBAC roles matrix' },
  { code: 'role.create', name: 'Create Custom Role', module: 'Roles', description: 'Create new company access role' },
  { code: 'role.edit', name: 'Edit Role Permissions', module: 'Roles', description: 'Update role permission assignments' },
  { code: 'role.delete', name: 'Delete Custom Role', module: 'Roles', description: 'Delete unused custom roles' },

  // Security & Audit
  { code: 'settings.view', name: 'View System Settings', module: 'Settings', description: 'View security & API settings' },
  { code: 'settings.manage', name: 'Manage System Settings', module: 'Settings', description: 'Update security policies' },
  { code: 'audit.view', name: 'View Audit Logs', module: 'Audit Logs', description: 'Inspect system governance audit logs' },

  // Approval Workflows
  { code: 'approval.view', name: 'View Approval Queue', module: 'Approvals', description: 'View approval requests and queue' },
  { code: 'approval.create', name: 'Submit Approval Requests', module: 'Approvals', description: 'Create and submit new approval requests' },
  { code: 'approval.approve', name: 'Approve / Reject Requests', module: 'Approvals', description: 'Approve or reject pending approval requests' },
  { code: 'approval.configure', name: 'Configure Workflows & Rules', module: 'Approvals', description: 'Configure workflow definitions and business rules (admin only)' },
];

export const PERMISSION_GROUPS: PermissionGroup[] = Array.from(
  new Set(ALL_PERMISSIONS.map((p) => p.module))
).map((mod) => ({
  module: mod,
  moduleName: mod,
  permissions: ALL_PERMISSIONS.filter((p) => p.module === mod),
}));

// Default permission mappings for enterprise roles
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS.map((p) => p.code),
  COMPANY_ADMIN: ALL_PERMISSIONS.map((p) => p.code),
  WAREHOUSE_MANAGER: [
    'dashboard.view', 'ai.view', 'warehouse.view', 'warehouse.edit',
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
    'asset.view', 'asset.create', 'asset.edit', 'asset.assign',
    'inbound.view', 'inbound.create', 'inbound.edit', 'inbound.approve',
    'outbound.view', 'outbound.create', 'outbound.edit', 'outbound.approve',
    'gatepass.view', 'gatepass.print', 'gatepass.approve',
    'transport.view', 'transport.create', 'transport.edit',
    'report.view', 'report.export', 'employee.view', 'employee.create', 'employee.edit',
    'company.view', 'role.view', 'audit.view',
    'approval.view', 'approval.create', 'approval.approve'
  ],
  INVENTORY_MANAGER: [
    'dashboard.view', 'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete', 'inventory.adjust',
    'inbound.view', 'inbound.create', 'inbound.edit', 'inbound.approve',
    'outbound.view', 'report.view', 'report.export'
  ],
  ASSET_MANAGER: [
    'dashboard.view', 'asset.view', 'asset.create', 'asset.edit', 'asset.delete', 'asset.assign',
    'report.view', 'report.export'
  ],
  INBOUND_SUPERVISOR: [
    'dashboard.view', 'inbound.view', 'inbound.create', 'inbound.edit', 'inbound.approve',
    'inventory.view', 'inventory.create', 'inventory.adjust'
  ],
  OUTBOUND_SUPERVISOR: [
    'dashboard.view', 'outbound.view', 'outbound.create', 'outbound.edit', 'outbound.approve',
    'gatepass.view', 'gatepass.print', 'gatepass.approve', 'inventory.view'
  ],
  TRANSPORTATION_MANAGER: [
    'dashboard.view', 'transport.view', 'transport.create', 'transport.edit',
    'gatepass.view', 'gatepass.print', 'gatepass.approve', 'outbound.view'
  ],
  WAREHOUSE_OPERATOR: [
    'dashboard.view', 'inventory.view', 'inbound.view', 'inbound.edit', 'outbound.view', 'outbound.edit'
  ],
  FORKLIFT_OPERATOR: [
    'dashboard.view', 'asset.view', 'inbound.view', 'outbound.view'
  ],
  PICKER: [
    'dashboard.view', 'outbound.view', 'outbound.edit', 'inventory.view'
  ],
  PACKER: [
    'dashboard.view', 'outbound.view', 'outbound.edit', 'inventory.view'
  ],
  LOADER: [
    'dashboard.view', 'inbound.view', 'outbound.view'
  ],
  SECURITY_OFFICER: [
    'dashboard.view', 'gatepass.view', 'gatepass.print', 'gatepass.approve', 'transport.view'
  ],
  FINANCE: [
    'dashboard.view', 'report.view', 'report.export', 'company.view', 'asset.view', 'inventory.view',
    'approval.view', 'approval.approve'
  ],
  HR: [
    'dashboard.view', 'employee.view', 'employee.create', 'employee.edit', 'employee.delete', 'company.view'
  ],
  AUDITOR: [
    'dashboard.view', 'warehouse.view', 'inventory.view', 'asset.view', 'inbound.view', 'outbound.view',
    'transport.view', 'gatepass.view', 'report.view', 'report.export', 'employee.view', 'company.view',
    'role.view', 'audit.view'
  ],
  SUPERVISOR: [
    'dashboard.view', 'inbound.view', 'inbound.create', 'inbound.edit',
    'outbound.view', 'outbound.create', 'outbound.edit', 'inventory.view', 'gatepass.view', 'gatepass.print',
    'approval.view', 'approval.create'
  ],
  INVENTORY_EXECUTIVE: [
    'dashboard.view', 'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust', 'inbound.view',
    'approval.view', 'approval.create'
  ],
  VIEWER: [
    'dashboard.view', 'warehouse.view', 'inventory.view', 'asset.view', 'report.view'
  ]
};

export const MASTER_NAVIGATION: NavItem[] = [
  { title: 'Executive Overview', href: '/dashboard', iconName: 'LayoutDashboard', requiredPermission: 'dashboard.view' },
  { title: 'Company Profile', href: '/dashboard/company-profile', iconName: 'Building2', requiredPermission: 'company.view' },
  { title: 'Employee Directory', href: '/dashboard/employees', iconName: 'Users', requiredPermission: 'employee.view' },
  { title: 'Roles & Permissions', href: '/dashboard/roles', iconName: 'ShieldCheck', requiredPermission: 'role.view' },
  { title: 'My Profile & Settings', href: '/dashboard/profile', iconName: 'User' },
  { title: 'AI Command Center', href: '/dashboard/ai-center', iconName: 'Sparkles', badge: 'AI Live', requiredPermission: 'ai.view' },
  { title: 'Enterprise AI Assistant', href: '/dashboard/ai-assistant', iconName: 'Bot', requiredPermission: 'ai.view' },
  { title: 'Predictive Inventory', href: '/dashboard/ai-inventory', iconName: 'TrendingUp', requiredPermission: 'ai.view' },
  { title: 'Predictive Maintenance', href: '/dashboard/ai-maintenance', iconName: 'Cpu', requiredPermission: 'ai.view' },
  { title: 'Workforce Intelligence', href: '/dashboard/ai-workforce', iconName: 'Brain', requiredPermission: 'ai.view' },
  { title: 'TMS Intelligence', href: '/dashboard/ai-transport', iconName: 'Navigation', requiredPermission: 'ai.view' },
  { title: 'Executive BI Analytics', href: '/dashboard/executive-bi', iconName: 'PieChart', requiredPermission: 'report.view' },
  { title: 'Workflow Automation', href: '/dashboard/automation', iconName: 'Workflow', badge: 'Active', requiredPermission: 'settings.view' },
  { title: 'Document Vault', href: '/dashboard/documents', iconName: 'FolderKanban', requiredPermission: 'dashboard.view' },
  { title: 'ERP Integrations', href: '/dashboard/integrations', iconName: 'Plug', requiredPermission: 'settings.view' },
  { title: 'IoT Sensors & Devices', href: '/dashboard/iot', iconName: 'Radio', requiredPermission: 'settings.view' },
  { title: 'Warehouse Hub', href: '/dashboard/warehouses', iconName: 'Warehouse', requiredPermission: 'warehouse.view' },
  { title: 'Asset Master', href: '/dashboard/assets', iconName: 'Box', requiredPermission: 'asset.view' },
  { title: 'Inventory Control', href: '/dashboard/inventory', iconName: 'Package', requiredPermission: 'inventory.view' },
  { title: 'Inbound Logistics', href: '/dashboard/inbound', iconName: 'Truck', requiredPermission: 'inbound.view' },
  { title: 'Outbound Dispatch', href: '/dashboard/outbound', iconName: 'Send', requiredPermission: 'outbound.view' },
  { title: 'Transportation (TMS)', href: '/dashboard/transportation', iconName: 'Compass', requiredPermission: 'transport.view' },
  { title: 'Workforce & Shift', href: '/dashboard/workforce', iconName: 'UserCheck', requiredPermission: 'employee.view' },
  { title: 'Equipment (MHE)', href: '/dashboard/equipment', iconName: 'Wrench', requiredPermission: 'asset.view' },
  { title: 'Dynamic KPI & SLA', href: '/dashboard/kpi-sla', iconName: 'Gauge', requiredPermission: 'report.view' },
  { title: 'Warehouse Compare', href: '/dashboard/comparison', iconName: 'GitCompare', requiredPermission: 'warehouse.view' },
  { title: 'Cost Analytics', href: '/dashboard/costs', iconName: 'DollarSign', requiredPermission: 'report.view' },
  { title: 'Approval Engine', href: '/dashboard/approvals', iconName: 'CheckSquare', requiredPermission: 'approval.view' },
  { title: 'Workflow Config', href: '/dashboard/approvals/workflow-config', iconName: 'Settings2', requiredPermission: 'approval.configure' },
  { title: 'Business Rules', href: '/dashboard/approvals/rules', iconName: 'GitBranchPlus', requiredPermission: 'approval.configure' },
  { title: 'Approval Queue', href: '/dashboard/approvals/queue', iconName: 'ListChecks', requiredPermission: 'approval.view' },
  { title: 'Notification Center', href: '/dashboard/approvals/notifications', iconName: 'BellRing', requiredPermission: 'approval.view' },
  { title: 'Maintenance Center', href: '/dashboard/maintenance', iconName: 'Hammer', requiredPermission: 'asset.view' },
  { title: 'Security Audit Logs', href: '/dashboard/audit-logs', iconName: 'FileText', requiredPermission: 'audit.view' },
  { title: 'Operational Calendar', href: '/dashboard/calendar', iconName: 'Calendar', requiredPermission: 'dashboard.view' },
  { title: 'User Access Control', href: '/dashboard/users', iconName: 'Users', requiredPermission: 'user.view' },
  { title: 'Reports & Analytics', href: '/dashboard/reports', iconName: 'BarChart3', requiredPermission: 'report.view' },
];

export function hasPermission(userPermissions: string[] | undefined, requiredPermission?: string): boolean {
  if (!requiredPermission) return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  return userPermissions.includes(requiredPermission) || userPermissions.includes('SUPER_ADMIN_ALL');
}

export function getNavForPermissions(userPermissions: string[] = []): NavItem[] {
  return MASTER_NAVIGATION.filter((item) => hasPermission(userPermissions, item.requiredPermission));
}

export function canAccessPath(userPermissions: string[] = [], path: string): boolean {
  if (path === '/dashboard' || path === '/dashboard/profile' || path.startsWith('/dashboard/employees/')) return true;
  const match = MASTER_NAVIGATION.find((item) => path.startsWith(item.href) && item.href !== '/dashboard');
  if (!match) return true;
  return hasPermission(userPermissions, match.requiredPermission);
}
