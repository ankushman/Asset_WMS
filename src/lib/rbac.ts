export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'SUPERVISOR'
  | 'INVENTORY_EXECUTIVE'
  | 'PICKER'
  | 'PACKER'
  | 'VIEWER';

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
}

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { title: 'Executive Overview', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Command Center', href: '/dashboard/ai-center', iconName: 'Sparkles', badge: 'AI Live' },
    { title: 'Enterprise AI Assistant', href: '/dashboard/ai-assistant', iconName: 'Bot' },
    { title: 'Predictive Inventory', href: '/dashboard/ai-inventory', iconName: 'TrendingUp' },
    { title: 'Predictive Maintenance', href: '/dashboard/ai-maintenance', iconName: 'Cpu' },
    { title: 'Workforce Intelligence', href: '/dashboard/ai-workforce', iconName: 'Brain' },
    { title: 'TMS Intelligence', href: '/dashboard/ai-transport', iconName: 'Navigation' },
    { title: 'Executive BI Analytics', href: '/dashboard/executive-bi', iconName: 'PieChart' },
    { title: 'Workflow Automation', href: '/dashboard/automation', iconName: 'Workflow', badge: 'Active' },
    { title: 'Document Vault', href: '/dashboard/documents', iconName: 'FolderKanban' },
    { title: 'ERP Integrations', href: '/dashboard/integrations', iconName: 'Plug' },
    { title: 'IoT Sensors & Devices', href: '/dashboard/iot', iconName: 'Radio' },
    { title: 'Security & Access Logs', href: '/dashboard/security', iconName: 'ShieldCheck' },
    { title: 'Company Management', href: '/dashboard/companies', iconName: 'Building2' },
    { title: 'Warehouse Hub', href: '/dashboard/warehouses', iconName: 'Warehouse' },
    { title: 'Asset Master', href: '/dashboard/assets', iconName: 'Box' },
    { title: 'Inventory Control', href: '/dashboard/inventory', iconName: 'Package' },
    { title: 'Inbound Logistics', href: '/dashboard/inbound', iconName: 'Truck' },
    { title: 'Outbound Dispatch', href: '/dashboard/outbound', iconName: 'Send' },
    { title: 'Transportation (TMS)', href: '/dashboard/transportation', iconName: 'Compass' },
    { title: 'Workforce & Shift', href: '/dashboard/workforce', iconName: 'UserCheck' },
    { title: 'Equipment (MHE)', href: '/dashboard/equipment', iconName: 'Wrench' },
    { title: 'Dynamic KPI & SLA', href: '/dashboard/kpi-sla', iconName: 'Gauge' },
    { title: 'Warehouse Compare', href: '/dashboard/comparison', iconName: 'GitCompare' },
    { title: 'Cost Analytics', href: '/dashboard/costs', iconName: 'DollarSign' },
    { title: 'Approval Engine', href: '/dashboard/approvals', iconName: 'CheckSquare' },
    { title: 'Maintenance Center', href: '/dashboard/maintenance', iconName: 'Hammer' },
    { title: 'Security Audit Logs', href: '/dashboard/audit-logs', iconName: 'FileText' },
    { title: 'Operational Calendar', href: '/dashboard/calendar', iconName: 'Calendar' },
    { title: 'User Access Control', href: '/dashboard/users', iconName: 'Users' },
    { title: 'Reports & Analytics', href: '/dashboard/reports', iconName: 'BarChart3' },
  ],
  COMPANY_ADMIN: [
    { title: 'Executive Overview', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Command Center', href: '/dashboard/ai-center', iconName: 'Sparkles', badge: 'AI' },
    { title: 'Enterprise AI Assistant', href: '/dashboard/ai-assistant', iconName: 'Bot' },
    { title: 'Predictive Inventory', href: '/dashboard/ai-inventory', iconName: 'TrendingUp' },
    { title: 'Workflow Automation', href: '/dashboard/automation', iconName: 'Workflow' },
    { title: 'ERP Integrations', href: '/dashboard/integrations', iconName: 'Plug' },
    { title: 'Warehouse Network', href: '/dashboard/warehouses', iconName: 'Warehouse' },
    { title: 'Asset Master', href: '/dashboard/assets', iconName: 'Box' },
    { title: 'Inventory Control', href: '/dashboard/inventory', iconName: 'Package' },
    { title: 'Transportation (TMS)', href: '/dashboard/transportation', iconName: 'Compass' },
    { title: 'Workforce & Shift', href: '/dashboard/workforce', iconName: 'UserCheck' },
    { title: 'Equipment (MHE)', href: '/dashboard/equipment', iconName: 'Wrench' },
    { title: 'Dynamic KPI & SLA', href: '/dashboard/kpi-sla', iconName: 'Gauge' },
    { title: 'Warehouse Compare', href: '/dashboard/comparison', iconName: 'GitCompare' },
    { title: 'Cost Analytics', href: '/dashboard/costs', iconName: 'DollarSign' },
    { title: 'Approval Engine', href: '/dashboard/approvals', iconName: 'CheckSquare' },
    { title: 'Reports & Analytics', href: '/dashboard/reports', iconName: 'BarChart3' },
  ],
  WAREHOUSE_MANAGER: [
    { title: 'Warehouse Dashboard', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Operational Alerts', href: '/dashboard/ai-center', iconName: 'Sparkles' },
    { title: 'AI Assistant', href: '/dashboard/ai-assistant', iconName: 'Bot' },
    { title: 'Predictive Maintenance', href: '/dashboard/ai-maintenance', iconName: 'Cpu' },
    { title: 'IoT Sensors', href: '/dashboard/iot', iconName: 'Radio' },
    { title: 'Document Vault', href: '/dashboard/documents', iconName: 'FolderKanban' },
    { title: 'My Warehouse', href: '/dashboard/warehouses', iconName: 'Warehouse' },
    { title: 'Assets & Equipment', href: '/dashboard/assets', iconName: 'Box' },
    { title: 'Inventory', href: '/dashboard/inventory', iconName: 'Package' },
    { title: 'Inbound Operations', href: '/dashboard/inbound', iconName: 'Truck' },
    { title: 'Outbound Dispatch', href: '/dashboard/outbound', iconName: 'Send' },
    { title: 'Transportation', href: '/dashboard/transportation', iconName: 'Compass' },
    { title: 'Workforce Roster', href: '/dashboard/workforce', iconName: 'UserCheck' },
    { title: 'Equipment Health', href: '/dashboard/equipment', iconName: 'Wrench' },
    { title: 'KPI & SLA Monitor', href: '/dashboard/kpi-sla', iconName: 'Gauge' },
    { title: 'Approvals', href: '/dashboard/approvals', iconName: 'CheckSquare' },
  ],
  SUPERVISOR: [
    { title: 'Operations Dashboard', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Assistant', href: '/dashboard/ai-assistant', iconName: 'Bot' },
    { title: 'Workforce Intelligence', href: '/dashboard/ai-workforce', iconName: 'Brain' },
    { title: 'Assets Tracking', href: '/dashboard/assets', iconName: 'Box' },
    { title: 'Inventory Stock', href: '/dashboard/inventory', iconName: 'Package' },
    { title: 'Inbound Receiving', href: '/dashboard/inbound', iconName: 'Truck' },
    { title: 'Outbound Dispatch', href: '/dashboard/outbound', iconName: 'Send' },
  ],
  INVENTORY_EXECUTIVE: [
    { title: 'Inventory Overview', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Demand Forecast', href: '/dashboard/ai-inventory', iconName: 'TrendingUp' },
    { title: 'Stock Register', href: '/dashboard/inventory', iconName: 'Package' },
    { title: 'Asset Catalog', href: '/dashboard/assets', iconName: 'Box' },
    { title: 'Inbound Receiving', href: '/dashboard/inbound', iconName: 'Truck' },
  ],
  PICKER: [
    { title: 'Picker Console', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'Outbound Tasks', href: '/dashboard/outbound', iconName: 'Send', badge: 'Active' },
    { title: 'Inventory Lookup', href: '/dashboard/inventory', iconName: 'Package' },
  ],
  PACKER: [
    { title: 'Packer Station', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'Packing Orders', href: '/dashboard/outbound', iconName: 'Send', badge: 'Ready' },
    { title: 'Inventory Catalog', href: '/dashboard/inventory', iconName: 'Package' },
  ],
  VIEWER: [
    { title: 'Read-Only Portal', href: '/dashboard', iconName: 'LayoutDashboard' },
    { title: 'AI Insights View', href: '/dashboard/ai-center', iconName: 'Sparkles' },
    { title: 'Executive BI Analytics', href: '/dashboard/executive-bi', iconName: 'PieChart' },
    { title: 'Warehouse Compare', href: '/dashboard/comparison', iconName: 'GitCompare' },
  ],
};

export function canAccessPath(role: UserRole, path: string): boolean {
  const allowedItems = ROLE_NAVIGATION[role] || [];
  if (path === '/dashboard') return true;
  return allowedItems.some((item) => path.startsWith(item.href));
}
