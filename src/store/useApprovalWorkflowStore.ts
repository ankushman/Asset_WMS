import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ====================== TYPES ======================

export type ApprovalWorkflowType =
  | 'PURCHASE_ORDER' | 'GOODS_RECEIPT' | 'ASSET_REGISTRATION' | 'ASSET_DISPOSAL'
  | 'ASSET_TRANSFER' | 'INVENTORY_ADJUSTMENT' | 'STOCK_TRANSFER' | 'WAREHOUSE_TRANSFER'
  | 'OUTBOUND_DISPATCH' | 'GATE_PASS' | 'USER_INVITATION';

export type ApprovalRequestStatus =
  | 'DRAFT' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'UNDER_REVIEW' | 'APPROVED'
  | 'PARTIALLY_APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export type ApprovalActionType = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'ESCALATED' | 'REASSIGNED' | 'COMMENTED' | 'CANCELLED';

export type ApprovalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EscalationStatus = 'NONE' | 'WARNING_SENT' | 'ESCALATED' | 'CRITICAL';
export type RuleField = 'ORDER_VALUE' | 'QUANTITY' | 'ASSET_VALUE' | 'PRIORITY' | 'WAREHOUSE' | 'DEPARTMENT' | 'ASSET_CATEGORY' | 'BUSINESS_UNIT' | 'REQUEST_TYPE';
export type RuleOperator = 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'GREATER_OR_EQUAL' | 'LESS_OR_EQUAL' | 'IN' | 'NOT_IN' | 'CONTAINS';

export interface WorkflowLevel {
  id: string;
  levelOrder: number;
  levelName: string;
  approverRole: string;
  approverId?: string;
  escalationHours: number;
}

export interface WorkflowDefinition {
  id: string;
  companyId: string;
  workflowType: ApprovalWorkflowType;
  name: string;
  description?: string;
  isActive: boolean;
  makerCheckerEnabled: boolean;
  levels: WorkflowLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalLevelStatus {
  id: string;
  levelOrder: number;
  levelName: string;
  approverRole: string;
  approverId?: string;
  approverName?: string;
  status: ApprovalRequestStatus;
  comments?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface ApprovalHistoryEntry {
  id: string;
  action: ApprovalActionType;
  userId: string;
  userName: string;
  userRole: string;
  levelOrder?: number;
  previousStatus?: string;
  newStatus?: string;
  comments?: string;
  createdAt: string;
}

export interface ApprovalRequestV2 {
  id: string;
  requestCode: string;
  companyId: string;
  warehouseId?: string;
  warehouseName?: string;
  workflowType: ApprovalWorkflowType;
  title: string;
  description?: string;
  module: string;
  requestData?: string;
  amount?: number;
  quantity?: number;
  priority: ApprovalPriority;
  currentLevel: number;
  totalLevels: number;
  status: ApprovalRequestStatus;
  escalationStatus: EscalationStatus;
  makerUserId: string;
  makerUserName: string;
  currentApproverId?: string;
  currentApproverName?: string;
  levelStatuses: ApprovalLevelStatus[];
  approvalHistory: ApprovalHistoryEntry[];
  submittedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  field: RuleField;
  operator: RuleOperator;
  value: string;
  workflowType: ApprovalWorkflowType;
  requiredApproverRole?: string;
  additionalLevels: number;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNotification {
  id: string;
  userId: string;
  companyId?: string;
  type: string;
  title: string;
  message: string;
  requestId?: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApprovalDashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  escalated: number;
  total: number;
  completionRate: number;
}

// ====================== INITIAL MOCK DATA ======================

const MOCK_WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: 'wfdef-001', companyId: 'comp-001', workflowType: 'PURCHASE_ORDER',
    name: 'Purchase Order Approval', description: 'Multi-level approval for all purchase orders',
    isActive: true, makerCheckerEnabled: true,
    levels: [
      { id: 'lvl-001', levelOrder: 1, levelName: 'Warehouse Manager Review', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
      { id: 'lvl-002', levelOrder: 2, levelName: 'Finance Approval', approverRole: 'FINANCE', escalationHours: 24 },
      { id: 'lvl-003', levelOrder: 3, levelName: 'Company Admin Signoff', approverRole: 'COMPANY_ADMIN', escalationHours: 48 },
    ],
    createdAt: '2026-07-20T08:00:00Z', updatedAt: '2026-07-20T08:00:00Z',
  },
  {
    id: 'wfdef-002', companyId: 'comp-001', workflowType: 'ASSET_DISPOSAL',
    name: 'Asset Disposal Approval', description: 'Approval workflow for disposing capital assets',
    isActive: true, makerCheckerEnabled: true,
    levels: [
      { id: 'lvl-004', levelOrder: 1, levelName: 'Asset Manager Review', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
      { id: 'lvl-005', levelOrder: 2, levelName: 'Company Admin Approval', approverRole: 'COMPANY_ADMIN', escalationHours: 48 },
    ],
    createdAt: '2026-07-20T09:00:00Z', updatedAt: '2026-07-20T09:00:00Z',
  },
  {
    id: 'wfdef-003', companyId: 'comp-001', workflowType: 'INVENTORY_ADJUSTMENT',
    name: 'Inventory Adjustment Approval', description: 'Approval for manual stock count adjustments',
    isActive: true, makerCheckerEnabled: true,
    levels: [
      { id: 'lvl-006', levelOrder: 1, levelName: 'Warehouse Manager Approval', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 12 },
    ],
    createdAt: '2026-07-21T10:00:00Z', updatedAt: '2026-07-21T10:00:00Z',
  },
  {
    id: 'wfdef-004', companyId: 'comp-001', workflowType: 'GOODS_RECEIPT',
    name: 'GRN Approval', description: 'Goods Receipt Note approval workflow',
    isActive: true, makerCheckerEnabled: true,
    levels: [
      { id: 'lvl-007', levelOrder: 1, levelName: 'Inbound Supervisor Approval', approverRole: 'SUPERVISOR', escalationHours: 8 },
      { id: 'lvl-008', levelOrder: 2, levelName: 'Warehouse Manager Signoff', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
    ],
    createdAt: '2026-07-22T08:00:00Z', updatedAt: '2026-07-22T08:00:00Z',
  },
  {
    id: 'wfdef-005', companyId: 'comp-001', workflowType: 'STOCK_TRANSFER',
    name: 'Stock Transfer Approval', description: 'Inter-warehouse stock transfer approval',
    isActive: true, makerCheckerEnabled: true,
    levels: [
      { id: 'lvl-009', levelOrder: 1, levelName: 'Source WH Manager', approverRole: 'WAREHOUSE_MANAGER', escalationHours: 24 },
      { id: 'lvl-010', levelOrder: 2, levelName: 'Finance Verification', approverRole: 'FINANCE', escalationHours: 24 },
    ],
    createdAt: '2026-07-22T10:00:00Z', updatedAt: '2026-07-22T10:00:00Z',
  },
  {
    id: 'wfdef-006', companyId: 'comp-001', workflowType: 'GATE_PASS',
    name: 'Gate Pass Approval', description: 'Security gate pass approval workflow',
    isActive: true, makerCheckerEnabled: false,
    levels: [
      { id: 'lvl-011', levelOrder: 1, levelName: 'Security Officer Clearance', approverRole: 'SECURITY_OFFICER', escalationHours: 4 },
    ],
    createdAt: '2026-07-23T08:00:00Z', updatedAt: '2026-07-23T08:00:00Z',
  },
];

const MOCK_REQUESTS: ApprovalRequestV2[] = [
  {
    id: 'req-001', requestCode: 'APR-M7K1A', companyId: 'comp-001', warehouseId: 'wh-001', warehouseName: 'Mumbai Central Mega Hub',
    workflowType: 'PURCHASE_ORDER', title: 'Procure 10 Zebra TC52 Android Handheld Scanners', description: 'Required for peak Q3 inbound volume surge. Current scanner fleet insufficient for projected 40% increase.',
    module: 'Assets', amount: 750000, quantity: 10, priority: 'HIGH',
    currentLevel: 2, totalLevels: 3, status: 'PARTIALLY_APPROVED', escalationStatus: 'NONE',
    makerUserId: 'usr-003', makerUserName: 'Rajesh Sharma', currentApproverId: 'usr-005', currentApproverName: 'Finance Approval',
    levelStatuses: [
      { id: 'ls-001', levelOrder: 1, levelName: 'Warehouse Manager Review', approverRole: 'WAREHOUSE_MANAGER', approverId: 'usr-002', approverName: 'Amitabh Verma', status: 'APPROVED', comments: 'Verified requirement. Q3 volume projections confirmed.', decidedAt: '2026-07-25T14:30:00Z', createdAt: '2026-07-24T09:15:00Z' },
      { id: 'ls-002', levelOrder: 2, levelName: 'Finance Approval', approverRole: 'FINANCE', status: 'PENDING_APPROVAL', createdAt: '2026-07-25T14:30:00Z' },
      { id: 'ls-003', levelOrder: 3, levelName: 'Company Admin Signoff', approverRole: 'COMPANY_ADMIN', status: 'DRAFT', createdAt: '2026-07-24T09:15:00Z' },
    ],
    approvalHistory: [
      { id: 'ah-001', action: 'SUBMITTED', userId: 'usr-003', userName: 'Rajesh Sharma', userRole: 'INVENTORY_EXECUTIVE', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Request submitted for approval.', createdAt: '2026-07-24T09:15:00Z' },
      { id: 'ah-002', action: 'APPROVED', userId: 'usr-002', userName: 'Amitabh Verma', userRole: 'WAREHOUSE_MANAGER', levelOrder: 1, previousStatus: 'PENDING_APPROVAL', newStatus: 'PARTIALLY_APPROVED', comments: 'Verified requirement. Q3 volume projections confirmed.', createdAt: '2026-07-25T14:30:00Z' },
    ],
    submittedAt: '2026-07-24T09:15:00Z', createdAt: '2026-07-24T09:15:00Z', updatedAt: '2026-07-25T14:30:00Z',
  },
  {
    id: 'req-002', requestCode: 'APR-N8L2B', companyId: 'comp-001', warehouseId: 'wh-001', warehouseName: 'Mumbai Central Mega Hub',
    workflowType: 'STOCK_TRANSFER', title: 'Transfer 300 Pallet Wrap rolls to Bangalore Depot', description: 'Inter-warehouse stock balancing for Q3 demand.',
    module: 'Inventory', amount: 45000, quantity: 300, priority: 'MEDIUM',
    currentLevel: 1, totalLevels: 2, status: 'PENDING_APPROVAL', escalationStatus: 'NONE',
    makerUserId: 'usr-002', makerUserName: 'Amitabh Verma', currentApproverId: 'usr-004', currentApproverName: 'Source WH Manager',
    levelStatuses: [
      { id: 'ls-004', levelOrder: 1, levelName: 'Source WH Manager', approverRole: 'WAREHOUSE_MANAGER', status: 'PENDING_APPROVAL', createdAt: '2026-07-24T10:30:00Z' },
      { id: 'ls-005', levelOrder: 2, levelName: 'Finance Verification', approverRole: 'FINANCE', status: 'DRAFT', createdAt: '2026-07-24T10:30:00Z' },
    ],
    approvalHistory: [
      { id: 'ah-003', action: 'SUBMITTED', userId: 'usr-002', userName: 'Amitabh Verma', userRole: 'WAREHOUSE_MANAGER', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Request submitted for approval.', createdAt: '2026-07-24T10:30:00Z' },
    ],
    submittedAt: '2026-07-24T10:30:00Z', createdAt: '2026-07-24T10:30:00Z', updatedAt: '2026-07-24T10:30:00Z',
  },
  {
    id: 'req-003', requestCode: 'APR-P9M3C', companyId: 'comp-001', warehouseId: 'wh-002', warehouseName: 'Hyderabad Gateway Depot',
    workflowType: 'ASSET_DISPOSAL', title: 'Dispose Caterpillar CAT C7 Generator (serial #CAT-7719)', description: 'Engine beyond economic repair. 12,000 hours logged. 3 major breakdowns in last quarter.',
    module: 'Assets', amount: 185000, priority: 'HIGH',
    currentLevel: 1, totalLevels: 2, status: 'PENDING_APPROVAL', escalationStatus: 'WARNING_SENT',
    makerUserId: 'usr-006', makerUserName: 'Karthik Reddy', currentApproverId: 'usr-002', currentApproverName: 'Asset Manager Review',
    levelStatuses: [
      { id: 'ls-006', levelOrder: 1, levelName: 'Asset Manager Review', approverRole: 'WAREHOUSE_MANAGER', status: 'PENDING_APPROVAL', createdAt: '2026-07-23T16:00:00Z' },
      { id: 'ls-007', levelOrder: 2, levelName: 'Company Admin Approval', approverRole: 'COMPANY_ADMIN', status: 'DRAFT', createdAt: '2026-07-23T16:00:00Z' },
    ],
    approvalHistory: [
      { id: 'ah-004', action: 'SUBMITTED', userId: 'usr-006', userName: 'Karthik Reddy', userRole: 'WAREHOUSE_MANAGER', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Engine beyond economic repair.', createdAt: '2026-07-23T16:00:00Z' },
      { id: 'ah-005', action: 'ESCALATED', userId: 'SYSTEM', userName: 'System Escalation', userRole: 'SYSTEM', levelOrder: 1, previousStatus: 'PENDING_APPROVAL', newStatus: 'PENDING_APPROVAL', comments: 'Warning: Pending for 28+ hours. Next-level manager notified.', createdAt: '2026-07-24T20:15:00Z' },
    ],
    submittedAt: '2026-07-23T16:00:00Z', createdAt: '2026-07-23T16:00:00Z', updatedAt: '2026-07-24T20:15:00Z',
  },
  {
    id: 'req-004', requestCode: 'APR-Q1N4D', companyId: 'comp-001', warehouseId: 'wh-001', warehouseName: 'Mumbai Central Mega Hub',
    workflowType: 'INVENTORY_ADJUSTMENT', title: 'Stock Adjustment — 150 units Honeywell Barcode Scanners', description: 'Cycle count variance. Physical count 2,850 vs system 3,000. Adjusting -150 units.',
    module: 'Inventory', quantity: 150, priority: 'MEDIUM',
    currentLevel: 1, totalLevels: 1, status: 'APPROVED', escalationStatus: 'NONE',
    makerUserId: 'usr-003', makerUserName: 'Rajesh Sharma', currentApproverName: 'Warehouse Manager Approval',
    levelStatuses: [
      { id: 'ls-008', levelOrder: 1, levelName: 'Warehouse Manager Approval', approverRole: 'WAREHOUSE_MANAGER', approverId: 'usr-002', approverName: 'Amitabh Verma', status: 'APPROVED', comments: 'Cycle count variance verified. Adjustment approved.', decidedAt: '2026-07-26T11:00:00Z', createdAt: '2026-07-26T09:00:00Z' },
    ],
    approvalHistory: [
      { id: 'ah-006', action: 'SUBMITTED', userId: 'usr-003', userName: 'Rajesh Sharma', userRole: 'INVENTORY_EXECUTIVE', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Cycle count variance.', createdAt: '2026-07-26T09:00:00Z' },
      { id: 'ah-007', action: 'APPROVED', userId: 'usr-002', userName: 'Amitabh Verma', userRole: 'WAREHOUSE_MANAGER', levelOrder: 1, previousStatus: 'PENDING_APPROVAL', newStatus: 'APPROVED', comments: 'Cycle count variance verified. Adjustment approved.', createdAt: '2026-07-26T11:00:00Z' },
    ],
    submittedAt: '2026-07-26T09:00:00Z', completedAt: '2026-07-26T11:00:00Z', createdAt: '2026-07-26T09:00:00Z', updatedAt: '2026-07-26T11:00:00Z',
  },
  {
    id: 'req-005', requestCode: 'APR-R2O5E', companyId: 'comp-001', warehouseId: 'wh-003', warehouseName: 'Delhi North Logistics Park',
    workflowType: 'PURCHASE_ORDER', title: 'Procure 5 Crown Electric Reach Trucks (Model ESR5260)', description: 'Fleet expansion for new cold storage wing.',
    module: 'Assets', amount: 12500000, quantity: 5, priority: 'CRITICAL',
    currentLevel: 3, totalLevels: 3, status: 'REJECTED', escalationStatus: 'NONE',
    makerUserId: 'usr-007', makerUserName: 'Priya Sundaram',
    levelStatuses: [
      { id: 'ls-009', levelOrder: 1, levelName: 'Warehouse Manager Review', approverRole: 'WAREHOUSE_MANAGER', approverId: 'usr-008', approverName: 'Suresh Patil', status: 'APPROVED', comments: 'Operational need confirmed.', decidedAt: '2026-07-22T16:00:00Z', createdAt: '2026-07-22T10:00:00Z' },
      { id: 'ls-010', levelOrder: 2, levelName: 'Finance Approval', approverRole: 'FINANCE', approverId: 'usr-005', approverName: 'Neha Kapoor', status: 'APPROVED', comments: 'Budget allocated under CAPEX FY27.', decidedAt: '2026-07-23T11:00:00Z', createdAt: '2026-07-22T16:00:00Z' },
      { id: 'ls-011', levelOrder: 3, levelName: 'Company Admin Signoff', approverRole: 'COMPANY_ADMIN', approverId: 'usr-001', approverName: 'Deepak Sangkaj', status: 'REJECTED', comments: 'Defer to Q4. Current fleet sufficient until cold storage wing construction completes in September.', decidedAt: '2026-07-24T09:00:00Z', createdAt: '2026-07-23T11:00:00Z' },
    ],
    approvalHistory: [
      { id: 'ah-008', action: 'SUBMITTED', userId: 'usr-007', userName: 'Priya Sundaram', userRole: 'WAREHOUSE_MANAGER', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Fleet expansion request.', createdAt: '2026-07-22T10:00:00Z' },
      { id: 'ah-009', action: 'APPROVED', userId: 'usr-008', userName: 'Suresh Patil', userRole: 'WAREHOUSE_MANAGER', levelOrder: 1, previousStatus: 'PENDING_APPROVAL', newStatus: 'PARTIALLY_APPROVED', comments: 'Operational need confirmed.', createdAt: '2026-07-22T16:00:00Z' },
      { id: 'ah-010', action: 'APPROVED', userId: 'usr-005', userName: 'Neha Kapoor', userRole: 'FINANCE', levelOrder: 2, previousStatus: 'PARTIALLY_APPROVED', newStatus: 'PARTIALLY_APPROVED', comments: 'Budget allocated under CAPEX FY27.', createdAt: '2026-07-23T11:00:00Z' },
      { id: 'ah-011', action: 'REJECTED', userId: 'usr-001', userName: 'Deepak Sangkaj', userRole: 'COMPANY_ADMIN', levelOrder: 3, previousStatus: 'PARTIALLY_APPROVED', newStatus: 'REJECTED', comments: 'Defer to Q4. Current fleet sufficient until cold storage wing construction completes.', createdAt: '2026-07-24T09:00:00Z' },
    ],
    submittedAt: '2026-07-22T10:00:00Z', completedAt: '2026-07-24T09:00:00Z', createdAt: '2026-07-22T10:00:00Z', updatedAt: '2026-07-24T09:00:00Z',
  },
];

const MOCK_BUSINESS_RULES: BusinessRule[] = [
  { id: 'rule-001', companyId: 'comp-001', name: 'High Value PO Approval', description: 'Purchase orders over ₹5,00,000 require Finance approval', field: 'ORDER_VALUE', operator: 'GREATER_THAN', value: '500000', workflowType: 'PURCHASE_ORDER', requiredApproverRole: 'FINANCE', additionalLevels: 1, isActive: true, priority: 10, createdAt: '2026-07-20T08:00:00Z', updatedAt: '2026-07-20T08:00:00Z' },
  { id: 'rule-002', companyId: 'comp-001', name: 'Asset Disposal Over ₹1L', description: 'Asset disposals over ₹1,00,000 require Company Admin approval', field: 'ASSET_VALUE', operator: 'GREATER_THAN', value: '100000', workflowType: 'ASSET_DISPOSAL', requiredApproverRole: 'COMPANY_ADMIN', additionalLevels: 1, isActive: true, priority: 10, createdAt: '2026-07-20T09:00:00Z', updatedAt: '2026-07-20T09:00:00Z' },
  { id: 'rule-003', companyId: 'comp-001', name: 'Large Inventory Adjustment', description: 'Stock adjustments over 100 units require WH Manager approval', field: 'QUANTITY', operator: 'GREATER_THAN', value: '100', workflowType: 'INVENTORY_ADJUSTMENT', requiredApproverRole: 'WAREHOUSE_MANAGER', additionalLevels: 0, isActive: true, priority: 5, createdAt: '2026-07-21T10:00:00Z', updatedAt: '2026-07-21T10:00:00Z' },
  { id: 'rule-004', companyId: 'comp-001', name: 'Critical Priority Escalation', description: 'Critical priority requests auto-escalate to Company Admin', field: 'PRIORITY', operator: 'EQUALS', value: 'CRITICAL', workflowType: 'PURCHASE_ORDER', requiredApproverRole: 'COMPANY_ADMIN', additionalLevels: 1, isActive: true, priority: 20, createdAt: '2026-07-22T08:00:00Z', updatedAt: '2026-07-22T08:00:00Z' },
  { id: 'rule-005', companyId: 'comp-001', name: 'Bulk Stock Transfer', description: 'Stock transfers over 200 units require Finance verification', field: 'QUANTITY', operator: 'GREATER_THAN', value: '200', workflowType: 'STOCK_TRANSFER', requiredApproverRole: 'FINANCE', additionalLevels: 1, isActive: true, priority: 8, createdAt: '2026-07-22T10:00:00Z', updatedAt: '2026-07-22T10:00:00Z' },
];

const MOCK_NOTIFICATIONS: WorkflowNotification[] = [
  { id: 'notif-001', userId: 'usr-001', companyId: 'comp-001', type: 'APPROVAL_REQUESTED', title: 'New Approval Request', message: 'Rajesh Sharma submitted: Procure 10 Zebra TC52 Scanners', requestId: 'req-001', isRead: false, link: '/dashboard/approvals/req-001', createdAt: '2026-07-24T09:15:00Z' },
  { id: 'notif-002', userId: 'usr-001', companyId: 'comp-001', type: 'APPROVAL_REQUESTED', title: 'New Approval Request', message: 'Amitabh Verma submitted: Transfer 300 Pallet Wrap rolls', requestId: 'req-002', isRead: false, link: '/dashboard/approvals/req-002', createdAt: '2026-07-24T10:30:00Z' },
  { id: 'notif-003', userId: 'usr-001', companyId: 'comp-001', type: 'APPROVAL_ESCALATED', title: 'Escalation Alert', message: 'Asset Disposal request pending for 28+ hours — Karthik Reddy', requestId: 'req-003', isRead: false, link: '/dashboard/approvals/req-003', createdAt: '2026-07-24T20:15:00Z' },
  { id: 'notif-004', userId: 'usr-001', companyId: 'comp-001', type: 'APPROVAL_COMPLETED', title: 'Adjustment Approved', message: 'Inventory Adjustment — 150 units approved by Amitabh Verma', requestId: 'req-004', isRead: true, link: '/dashboard/approvals/req-004', createdAt: '2026-07-26T11:00:00Z' },
  { id: 'notif-005', userId: 'usr-001', companyId: 'comp-001', type: 'APPROVAL_REJECTED', title: 'Request Rejected', message: 'Crown Reach Trucks PO rejected by Deepak Sangkaj', requestId: 'req-005', isRead: true, link: '/dashboard/approvals/req-005', createdAt: '2026-07-24T09:00:00Z' },
];

// ====================== STORE ======================

interface ApprovalWorkflowState {
  workflowDefinitions: WorkflowDefinition[];
  requests: ApprovalRequestV2[];
  businessRules: BusinessRule[];
  notifications: WorkflowNotification[];
  stats: ApprovalDashboardStats;

  // Workflow definition actions
  addWorkflowDefinition: (def: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflowDefinition: (id: string, updates: Partial<WorkflowDefinition>) => void;
  deleteWorkflowDefinition: (id: string) => void;
  toggleWorkflowActive: (id: string) => void;

  // Request actions
  submitRequest: (data: { companyId: string; warehouseId?: string; warehouseName?: string; workflowType: ApprovalWorkflowType; title: string; description?: string; module: string; amount?: number; quantity?: number; priority: ApprovalPriority; makerUserId: string; makerUserName: string }) => void;
  approveRequest: (requestId: string, userId: string, userName: string, userRole: string, comments?: string) => void;
  rejectRequest: (requestId: string, userId: string, userName: string, userRole: string, comments?: string) => void;
  returnRequest: (requestId: string, userId: string, userName: string, userRole: string, comments?: string) => void;
  reassignRequest: (requestId: string, userId: string, userName: string, userRole: string, newApproverId: string, newApproverName: string, comments?: string) => void;
  cancelRequest: (requestId: string, userId: string, userName: string, comments?: string) => void;
  addComment: (requestId: string, userId: string, userName: string, userRole: string, comment: string) => void;

  // Business rule actions
  addBusinessRule: (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBusinessRule: (id: string, updates: Partial<BusinessRule>) => void;
  deleteBusinessRule: (id: string) => void;
  toggleRuleActive: (id: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<WorkflowNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Computed
  getUnreadCount: () => number;
  getPendingRequests: () => ApprovalRequestV2[];
  getRequestById: (id: string) => ApprovalRequestV2 | undefined;
}

function computeStats(requests: ApprovalRequestV2[]): ApprovalDashboardStats {
  const pending = requests.filter(r => ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(r.status)).length;
  const approved = requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  const escalated = requests.filter(r => r.escalationStatus !== 'NONE').length;
  const total = requests.length;
  return { pending, approved, rejected, escalated, total, completionRate: total > 0 ? Math.round((approved / total) * 100) : 0 };
}

export const useApprovalWorkflowStore = create<ApprovalWorkflowState>()(
  persist(
    (set, get) => ({
      workflowDefinitions: MOCK_WORKFLOW_DEFINITIONS,
      requests: MOCK_REQUESTS,
      businessRules: MOCK_BUSINESS_RULES,
      notifications: MOCK_NOTIFICATIONS,
      stats: computeStats(MOCK_REQUESTS),

      // ---- Workflow Definitions ----
      addWorkflowDefinition: (def) => set((state) => {
        const newDef: WorkflowDefinition = { ...def, id: `wfdef-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        return { workflowDefinitions: [newDef, ...state.workflowDefinitions] };
      }),
      updateWorkflowDefinition: (id, updates) => set((state) => ({
        workflowDefinitions: state.workflowDefinitions.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d),
      })),
      deleteWorkflowDefinition: (id) => set((state) => ({
        workflowDefinitions: state.workflowDefinitions.filter(d => d.id !== id),
      })),
      toggleWorkflowActive: (id) => set((state) => ({
        workflowDefinitions: state.workflowDefinitions.map(d => d.id === id ? { ...d, isActive: !d.isActive, updatedAt: new Date().toISOString() } : d),
      })),

      // ---- Requests ----
      submitRequest: (data) => set((state) => {
        const def = state.workflowDefinitions.find(d => d.workflowType === data.workflowType && d.isActive);
        const levels = def?.levels || [{ id: 'default', levelOrder: 1, levelName: 'Default Approval', approverRole: 'COMPANY_ADMIN', escalationHours: 24 }];
        const requestCode = `APR-${Date.now().toString(36).toUpperCase()}`;
        const now = new Date().toISOString();

        const newRequest: ApprovalRequestV2 = {
          id: `req-${Date.now()}`, requestCode, companyId: data.companyId,
          warehouseId: data.warehouseId, warehouseName: data.warehouseName,
          workflowType: data.workflowType, title: data.title, description: data.description,
          module: data.module, amount: data.amount, quantity: data.quantity,
          priority: data.priority, currentLevel: 1, totalLevels: levels.length,
          status: 'PENDING_APPROVAL', escalationStatus: 'NONE',
          makerUserId: data.makerUserId, makerUserName: data.makerUserName,
          currentApproverName: levels[0].approverRole,
          levelStatuses: levels.map((lvl, i) => ({
            id: `ls-${Date.now()}-${i}`, levelOrder: lvl.levelOrder, levelName: lvl.levelName,
            approverRole: lvl.approverRole, status: i === 0 ? 'PENDING_APPROVAL' as const : 'DRAFT' as const, createdAt: now,
          })),
          approvalHistory: [{
            id: `ah-${Date.now()}`, action: 'SUBMITTED', userId: data.makerUserId, userName: data.makerUserName,
            userRole: 'MAKER', previousStatus: 'DRAFT', newStatus: 'PENDING_APPROVAL', comments: 'Request submitted for approval.', createdAt: now,
          }],
          submittedAt: now, createdAt: now, updatedAt: now,
        };
        const newRequests = [newRequest, ...state.requests];
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      approveRequest: (requestId, userId, userName, userRole, comments) => set((state) => {
        const newRequests = state.requests.map(req => {
          if (req.id !== requestId) return req;
          if (req.makerUserId === userId) return req; // Maker-checker block (silently skip)

          const now = new Date().toISOString();
          const isLastLevel = req.currentLevel >= req.totalLevels;
          const newStatus: ApprovalRequestStatus = isLastLevel ? 'APPROVED' : 'PARTIALLY_APPROVED';

          const updatedLevelStatuses = req.levelStatuses.map((ls, i) => {
            if (ls.levelOrder === req.currentLevel) return { ...ls, status: 'APPROVED' as const, approverId: userId, approverName: userName, comments, decidedAt: now };
            if (ls.levelOrder === req.currentLevel + 1 && !isLastLevel) return { ...ls, status: 'PENDING_APPROVAL' as const };
            return ls;
          });

          return {
            ...req, status: newStatus,
            currentLevel: isLastLevel ? req.currentLevel : req.currentLevel + 1,
            completedAt: isLastLevel ? now : undefined,
            updatedAt: now,
            levelStatuses: updatedLevelStatuses,
            approvalHistory: [...req.approvalHistory, {
              id: `ah-${Date.now()}`, action: 'APPROVED' as const, userId, userName, userRole,
              levelOrder: req.currentLevel, previousStatus: req.status, newStatus, comments, createdAt: now,
            }],
          };
        });
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      rejectRequest: (requestId, userId, userName, userRole, comments) => set((state) => {
        const newRequests = state.requests.map(req => {
          if (req.id !== requestId) return req;
          const now = new Date().toISOString();
          return {
            ...req, status: 'REJECTED' as const, completedAt: now, updatedAt: now,
            levelStatuses: req.levelStatuses.map(ls => ls.levelOrder === req.currentLevel ? { ...ls, status: 'REJECTED' as const, approverId: userId, approverName: userName, comments, decidedAt: now } : ls),
            approvalHistory: [...req.approvalHistory, {
              id: `ah-${Date.now()}`, action: 'REJECTED' as const, userId, userName, userRole,
              levelOrder: req.currentLevel, previousStatus: req.status, newStatus: 'REJECTED', comments, createdAt: now,
            }],
          };
        });
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      returnRequest: (requestId, userId, userName, userRole, comments) => set((state) => {
        const newRequests = state.requests.map(req => {
          if (req.id !== requestId) return req;
          const now = new Date().toISOString();
          return {
            ...req, status: 'UNDER_REVIEW' as const, updatedAt: now,
            approvalHistory: [...req.approvalHistory, {
              id: `ah-${Date.now()}`, action: 'RETURNED' as const, userId, userName, userRole,
              levelOrder: req.currentLevel, previousStatus: req.status, newStatus: 'UNDER_REVIEW', comments: comments || 'More information requested.', createdAt: now,
            }],
          };
        });
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      reassignRequest: (requestId, userId, userName, userRole, newApproverId, newApproverName, comments) => set((state) => {
        const newRequests = state.requests.map(req => {
          if (req.id !== requestId) return req;
          const now = new Date().toISOString();
          return {
            ...req, currentApproverId: newApproverId, currentApproverName: newApproverName, updatedAt: now,
            levelStatuses: req.levelStatuses.map(ls => ls.levelOrder === req.currentLevel ? { ...ls, approverId: newApproverId, approverName: newApproverName } : ls),
            approvalHistory: [...req.approvalHistory, {
              id: `ah-${Date.now()}`, action: 'REASSIGNED' as const, userId, userName, userRole,
              levelOrder: req.currentLevel, previousStatus: req.status, newStatus: req.status,
              comments: `Reassigned to ${newApproverName}. ${comments || ''}`, createdAt: now,
            }],
          };
        });
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      cancelRequest: (requestId, userId, userName, comments) => set((state) => {
        const newRequests = state.requests.map(req => {
          if (req.id !== requestId) return req;
          const now = new Date().toISOString();
          return {
            ...req, status: 'CANCELLED' as const, completedAt: now, updatedAt: now,
            approvalHistory: [...req.approvalHistory, {
              id: `ah-${Date.now()}`, action: 'CANCELLED' as const, userId, userName, userRole: 'MAKER',
              previousStatus: req.status, newStatus: 'CANCELLED', comments: comments || 'Request cancelled by maker.', createdAt: now,
            }],
          };
        });
        return { requests: newRequests, stats: computeStats(newRequests) };
      }),

      addComment: (requestId, userId, userName, userRole, comment) => set((state) => ({
        requests: state.requests.map(req => req.id !== requestId ? req : {
          ...req,
          approvalHistory: [...req.approvalHistory, {
            id: `ah-${Date.now()}`, action: 'COMMENTED' as const, userId, userName, userRole,
            comments: comment, createdAt: new Date().toISOString(),
          }],
        }),
      })),

      // ---- Business Rules ----
      addBusinessRule: (rule) => set((state) => ({
        businessRules: [{ ...rule, id: `rule-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state.businessRules],
      })),
      updateBusinessRule: (id, updates) => set((state) => ({
        businessRules: state.businessRules.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r),
      })),
      deleteBusinessRule: (id) => set((state) => ({
        businessRules: state.businessRules.filter(r => r.id !== id),
      })),
      toggleRuleActive: (id) => set((state) => ({
        businessRules: state.businessRules.map(r => r.id === id ? { ...r, isActive: !r.isActive, updatedAt: new Date().toISOString() } : r),
      })),

      // ---- Notifications ----
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      })),
      addNotification: (notif) => set((state) => ({
        notifications: [{ ...notif, id: `notif-${Date.now()}`, isRead: false, createdAt: new Date().toISOString() }, ...state.notifications],
      })),

      // ---- Computed ----
      getUnreadCount: () => get().notifications.filter(n => !n.isRead).length,
      getPendingRequests: () => get().requests.filter(r => ['PENDING_APPROVAL', 'PARTIALLY_APPROVED', 'UNDER_REVIEW'].includes(r.status)),
      getRequestById: (id) => get().requests.find(r => r.id === id),
    }),
    { name: 'sankaj-approval-workflow-storage' }
  )
);
