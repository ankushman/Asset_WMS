import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, DEFAULT_ROLE_PERMISSIONS, ALL_PERMISSIONS, hasPermission as evalPermission } from '@/lib/rbac';
import { formatAuthError } from '@/lib/auth-errors';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import Cookies from 'js-cookie';

export type UserAccountStatus = 'PENDING_INVITATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  subscription: string;
  currentPlan: string;
  registrationDate: string;
}

export interface CustomRoleRecord {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description: string;
  isDefault: boolean;
  permissions: string[];
  assignedUsersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  companyId: string;
  companyName: string;
  permissions: string[];
  warehouseId?: string;
  warehouseName?: string;
  department?: string;
  designation?: string;
  jobTitle?: string;
  employeeIdCode?: string;
  emergencyContact?: string;
  avatar: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeIdCode: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  companyId: string;
  warehouseId?: string;
  warehouseName?: string;
  department: string;
  designation: string;
  jobTitle: string;
  avatar: string;
  invitationToken?: string;
  invitationExpiresAt?: string;
  emergencyContact?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  performedBy: string;
  performedByName: string;
  companyId: string;
  targetUser: string;
  targetUserName: string;
  action: string;
  details: string;
  ipAddress: string;
}

interface AuthState {
  user: AuthUser | null;
  companyProfile: CompanyProfile | null;
  roles: CustomRoleRecord[];
  employees: Employee[];
  auditLogs: AuditLogRecord[];
  originalRole: UserRole;
  impersonatedRole: UserRole | null;
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
  hasPermission: (permissionCode: string) => boolean;
  impersonateRole: (role: UserRole) => boolean;
  exitImpersonation: () => void;
  signUpWithSupabase: (params: {
    email: string;
    password: string;
    name: string;
    phone: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    industry: string;
    warehouseCount?: number;
    gstNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signInWithSupabase: (params: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateCompanyProfile: (data: Partial<CompanyProfile>) => void;
  updateUserProfile: (data: Partial<AuthUser>) => void;
  inviteEmployee: (params: {
    name: string;
    email: string;
    phone: string;
    employeeIdCode?: string;
    department: string;
    designation: string;
    warehouseId?: string;
    warehouseName?: string;
    role: UserRole;
  }) => { success: boolean; token?: string; error?: string };
  activateEmployeeAccount: (params: {
    token: string;
    password: string;
  }) => { success: boolean; error?: string };
  updateEmployeeStatus: (employeeId: string, status: UserAccountStatus) => void;
  updateEmployeeDetails: (employeeId: string, details: Partial<Employee>) => void;
  deleteEmployee: (employeeId: string) => void;
  createRole: (roleData: { name: string; description: string; permissions: string[] }) => { success: boolean; error?: string };
  updateRole: (roleId: string, roleData: { name?: string; description?: string; permissions?: string[] }) => { success: boolean; error?: string };
  duplicateRole: (roleId: string, newName?: string) => { success: boolean; newRole?: CustomRoleRecord };
  deleteRole: (roleId: string) => { success: boolean; error?: string };
  addAuditLog: (action: string, targetUser: string, targetUserName: string, details: string) => void;
}

const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  id: 'comp-001',
  name: 'Sankaj Logistics Limited',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
  industry: 'Logistics & Supply Chain',
  gstNumber: '27AAACS1429B1ZS',
  panNumber: 'AAACS1429B',
  cinNumber: 'U63090MH2020PLC345678',
  email: 'corporate@sankajlogistics.com',
  phone: '+91 22 4918 2000',
  website: 'https://sankajlogistics.com',
  address: 'BKC Financial Tower, Plot 42, G Block',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  postalCode: '400051',
  subscription: 'ENTERPRISE_MULTI_HUB',
  currentPlan: 'Enterprise Multi-Hub Unlimited',
  registrationDate: '2025-01-01',
};

const INITIAL_DEFAULT_ROLES: CustomRoleRecord[] = [
  { id: 'role-001', companyId: 'comp-001', name: 'Super Admin', code: 'SUPER_ADMIN', description: 'Full Unrestricted System Governance & Tenant Control', isDefault: true, permissions: ALL_PERMISSIONS.map(p => p.code), assignedUsersCount: 1, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-002', companyId: 'comp-001', name: 'Company Admin', code: 'COMPANY_ADMIN', description: 'Company-Wide Workspace & Employee Administration', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.COMPANY_ADMIN || [], assignedUsersCount: 1, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-003', companyId: 'comp-001', name: 'Warehouse Manager', code: 'WAREHOUSE_MANAGER', description: 'Full Facility-Level Operational & Asset Control', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.WAREHOUSE_MANAGER || [], assignedUsersCount: 1, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-004', companyId: 'comp-001', name: 'Inventory Manager', code: 'INVENTORY_MANAGER', description: 'Stock Control, SKU Catalog & Reorder Management', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.INVENTORY_MANAGER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-005', companyId: 'comp-001', name: 'Asset Manager', code: 'ASSET_MANAGER', description: 'MHE Machinery, Equipment & Asset Lifecycle Control', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.ASSET_MANAGER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-006', companyId: 'comp-001', name: 'Inbound Supervisor', code: 'INBOUND_SUPERVISOR', description: 'Dock Allocation, Unloading & GRN Processing', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.INBOUND_SUPERVISOR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-007', companyId: 'comp-001', name: 'Outbound Supervisor', code: 'OUTBOUND_SUPERVISOR', description: 'Picking, Packing & Gate Pass Authorization', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.OUTBOUND_SUPERVISOR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-008', companyId: 'comp-001', name: 'Transportation Manager', code: 'TRANSPORTATION_MANAGER', description: 'TMS Delivery Routes, Fleet & Driver Scheduling', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.TRANSPORTATION_MANAGER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-009', companyId: 'comp-001', name: 'Warehouse Operator', code: 'WAREHOUSE_OPERATOR', description: 'Physical Warehouse Material Movement Operator', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.WAREHOUSE_OPERATOR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-010', companyId: 'comp-001', name: 'Forklift Operator', code: 'FORKLIFT_OPERATOR', description: 'High-Reach Stacker & Heavy MHE Operator', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.FORKLIFT_OPERATOR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-011', companyId: 'comp-001', name: 'Picker', code: 'PICKER', description: 'Outbound Picking Station Operator', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.PICKER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-012', companyId: 'comp-001', name: 'Packer', code: 'PACKER', description: 'Outbound Packing Station Operator', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.PACKER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-013', companyId: 'comp-001', name: 'Loader', code: 'LOADER', description: 'Truck Dock Vehicle Loader', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.LOADER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-014', companyId: 'comp-001', name: 'Security Officer', code: 'SECURITY_OFFICER', description: 'Gate Pass Clearance & Vehicle Security Exit Officer', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.SECURITY_OFFICER || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-015', companyId: 'comp-001', name: 'Finance', code: 'FINANCE', description: 'Financial Auditing, Billing & Cost Reports View', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.FINANCE || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-016', companyId: 'comp-001', name: 'HR', code: 'HR', description: 'Employee Directory & Onboarding Management', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.HR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'role-017', companyId: 'comp-001', name: 'Auditor', code: 'AUDITOR', description: 'Compliance Read-Only Inspector & Audit Logs View', isDefault: true, permissions: DEFAULT_ROLE_PERMISSIONS.AUDITOR || [], assignedUsersCount: 0, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

const INITIAL_EMPLOYEES_ROSTER: Employee[] = [
  {
    id: 'usr-001',
    name: 'Super Admin User',
    email: 'admin@sankajlogistics.com',
    phone: '+91 98765 43210',
    employeeIdCode: 'EMP-ADM-001',
    role: 'SUPER_ADMIN',
    accountStatus: 'ACTIVE',
    companyId: 'comp-001',
    department: 'Executive Operations',
    designation: 'Chief Technology Officer',
    jobTitle: 'VP of Technology & WMS Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    emergencyContact: 'Aarav Sharma (+91 98765 11111)',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2026-07-29T12:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Deepak Sankaj',
    email: 'deepak@sankajlogistics.com',
    phone: '+91 99887 76655',
    employeeIdCode: 'EMP-ADM-002',
    role: 'COMPANY_ADMIN',
    accountStatus: 'ACTIVE',
    companyId: 'comp-001',
    department: 'Corporate Strategy',
    designation: 'Managing Director',
    jobTitle: 'Head of Enterprise Supply Chain',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    emergencyContact: 'Sunita Sankaj (+91 99887 00000)',
    createdAt: '2025-01-10T10:00:00Z',
    lastLoginAt: '2026-07-28T16:30:00Z',
  },
  {
    id: 'usr-003',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@sankajlogistics.com',
    phone: '+91 91234 56789',
    employeeIdCode: 'EMP-MGR-003',
    role: 'WAREHOUSE_MANAGER',
    accountStatus: 'ACTIVE',
    companyId: 'comp-001',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    department: 'Warehouse Operations',
    designation: 'Facility General Manager',
    jobTitle: 'Mumbai Hub Operations Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    emergencyContact: 'Meena Sharma (+91 91234 00000)',
    createdAt: '2025-01-15T11:00:00Z',
    lastLoginAt: '2026-07-29T09:15:00Z',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      companyProfile: INITIAL_COMPANY_PROFILE,
      roles: INITIAL_DEFAULT_ROLES,
      employees: INITIAL_EMPLOYEES_ROSTER,
      auditLogs: [
        {
          id: 'log-001',
          timestamp: '2026-07-29 10:00 AM',
          performedBy: 'usr-001',
          performedByName: 'Super Admin User',
          companyId: 'comp-001',
          targetUser: 'usr-003',
          targetUserName: 'Rajesh Sharma',
          action: 'EMPLOYEE_INVITED',
          details: 'Assigned as Warehouse Manager for Mumbai Central Mega Hub.',
          ipAddress: '192.168.1.100',
        },
      ],
      originalRole: 'VIEWER',
      impersonatedRole: null,
      isAuthenticated: false,
      token: null,

      hasPermission: (permissionCode: string) => {
        const { user } = get();
        if (!user) return false;
        return evalPermission(user.permissions, permissionCode);
      },

      logout: async () => {
        Cookies.remove('token');
        set({
          user: null,
          originalRole: 'VIEWER',
          impersonatedRole: null,
          isAuthenticated: false,
          token: null,
        });
      },

      impersonateRole: (targetRole: UserRole) => {
        const { originalRole, roles } = get();
        if (originalRole !== 'SUPER_ADMIN') {
          console.warn('Security Enforcement: Role impersonation denied. User is not a Super Admin.');
          return false;
        }

        const isResettingToSelf = targetRole === 'SUPER_ADMIN';
        const roleRecord = roles.find((r) => r.code === targetRole);
        const resolvedPermissions = roleRecord ? roleRecord.permissions : DEFAULT_ROLE_PERMISSIONS[targetRole] || [];

        set((state) => ({
          impersonatedRole: isResettingToSelf ? null : targetRole,
          user: state.user ? { ...state.user, role: targetRole, permissions: resolvedPermissions } : null,
        }));
        return true;
      },

      exitImpersonation: () => {
        const { originalRole, roles } = get();
        const roleRecord = roles.find((r) => r.code === originalRole);
        const resolvedPermissions = roleRecord ? roleRecord.permissions : DEFAULT_ROLE_PERMISSIONS[originalRole] || [];

        set((state) => ({
          impersonatedRole: null,
          user: state.user ? { ...state.user, role: originalRole, permissions: resolvedPermissions } : null,
        }));
      },

      signUpWithSupabase: async ({
        email,
        password,
        name,
        phone,
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        industry,
        warehouseCount,
        gstNumber,
      }) => {
        const role: UserRole = 'SUPER_ADMIN';
        const newCompanyId = `comp-${Date.now()}`;
        const superAdminPermissions = ALL_PERMISSIONS.map((p) => p.code);

        const createdCompany: CompanyProfile = {
          id: newCompanyId,
          name: companyName,
          logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
          industry: industry || 'Logistics & Supply Chain',
          gstNumber: gstNumber || `27${name.slice(0, 3).toUpperCase()}1234F1Z9`,
          panNumber: `${name.slice(0, 4).toUpperCase()}1234P`,
          cinNumber: `U63090MH2026PLC${Math.floor(100000 + Math.random() * 900000)}`,
          email: companyEmail,
          phone: companyPhone,
          website: `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          address: companyAddress,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001',
          subscription: 'ENTERPRISE_MULTI_HUB',
          currentPlan: 'Enterprise Multi-Hub Unlimited',
          registrationDate: new Date().toISOString().split('T')[0],
        };

        let supabaseUserId = `usr-${Date.now()}`;
        let authToken = `session-token-${Date.now()}`;

        const newAdminUser: AuthUser = {
          id: supabaseUserId,
          name,
          email,
          phone,
          role,
          accountStatus: 'ACTIVE',
          companyId: newCompanyId,
          companyName,
          permissions: superAdminPermissions,
          department: 'Executive Management',
          designation: 'Super Administrator',
          jobTitle: 'Enterprise Administrator',
          employeeIdCode: 'EMP-ADM-001',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        const newAdminEmployeeRecord: Employee = {
          id: supabaseUserId,
          name,
          email,
          phone,
          employeeIdCode: 'EMP-ADM-001',
          role,
          accountStatus: 'ACTIVE',
          companyId: newCompanyId,
          department: 'Executive Management',
          designation: 'Super Administrator',
          jobTitle: 'Enterprise Administrator',
          avatar: newAdminUser.avatar,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        Cookies.set('token', authToken, { expires: 7 });

        set((state) => ({
          user: newAdminUser,
          companyProfile: createdCompany,
          employees: [newAdminEmployeeRecord, ...state.employees],
          originalRole: role,
          impersonatedRole: null,
          isAuthenticated: true,
          token: authToken,
        }));

        get().addAuditLog(
          'COMPANY_REGISTERED',
          supabaseUserId,
          name,
          `Company workspace ${companyName} created with Super Admin ${name}.`
        );

        return { success: true };
      },

      signInWithSupabase: async ({ email, password }) => {
        console.log('[Supabase Auth Login] Attempting login for email:', email);
        const { employees, roles } = get();
        const existingEmployee = employees.find(
          (e) => e.email.toLowerCase() === email.toLowerCase()
        );

        if (existingEmployee) {
          if (existingEmployee.accountStatus === 'SUSPENDED') {
            console.warn('[Supabase Auth Guard] Access denied: User account is SUSPENDED.');
            return {
              success: false,
              error: 'Your account has been suspended by your corporate administrator. Access denied.',
            };
          }
          if (existingEmployee.accountStatus === 'DEACTIVATED') {
            console.warn('[Supabase Auth Guard] Access denied: User account is DEACTIVATED.');
            return {
              success: false,
              error: 'Your account has been deactivated. Please contact HR or IT administrator.',
            };
          }
          if (existingEmployee.accountStatus === 'PENDING_INVITATION') {
            console.warn('[Supabase Auth Guard] Access denied: User account is PENDING_INVITATION.');
            return {
              success: false,
              error: 'Your invitation is pending activation. Please use the activation link sent to your email to set your password.',
            };
          }
        }



        if (existingEmployee) {
          const roleRecord = roles.find((r) => r.code === existingEmployee.role);
          const resolvedPermissions = roleRecord ? roleRecord.permissions : DEFAULT_ROLE_PERMISSIONS[existingEmployee.role] || [];

          const userProfile: AuthUser = {
            id: existingEmployee.id,
            name: existingEmployee.name,
            email: existingEmployee.email,
            phone: existingEmployee.phone,
            role: existingEmployee.role,
            accountStatus: existingEmployee.accountStatus,
            companyId: existingEmployee.companyId,
            companyName: 'Sankaj Logistics Limited',
            permissions: resolvedPermissions,
            department: existingEmployee.department,
            designation: existingEmployee.designation,
            jobTitle: existingEmployee.jobTitle,
            employeeIdCode: existingEmployee.employeeIdCode,
            avatar: existingEmployee.avatar,
            createdAt: existingEmployee.createdAt,
            lastLoginAt: new Date().toISOString(),
          };

          Cookies.set('token', 'session-token-active', { expires: 7 });
          set({
            user: userProfile,
            originalRole: existingEmployee.role,
            impersonatedRole: null,
            isAuthenticated: true,
            token: 'session-token-active',
          });

          return { success: true };
        }

        return {
          success: false,
          error: 'Authentication failed. Please verify your email and password.',
        };
      },

      updateCompanyProfile: (data) => {
        set((state) => ({
          companyProfile: state.companyProfile ? { ...state.companyProfile, ...data } : null,
        }));
        const currentUser = get().user;
        if (currentUser) {
          get().addAuditLog(
            'COMPANY_PROFILE_UPDATED',
            currentUser.id,
            currentUser.name,
            `Company profile details updated.`
          );
        }
      },

      updateUserProfile: (data) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...data } : null;
          const updatedEmployees = state.employees.map((emp) =>
            emp.id === state.user?.id ? { ...emp, ...data } : emp
          );
          return { user: updatedUser, employees: updatedEmployees };
        });
        const currentUser = get().user;
        if (currentUser) {
          get().addAuditLog(
            'PROFILE_UPDATED',
            currentUser.id,
            currentUser.name,
            `User personal profile updated.`
          );
        }
      },

      inviteEmployee: ({
        name,
        email,
        phone,
        employeeIdCode,
        department,
        designation,
        warehouseId,
        warehouseName,
        role,
      }) => {
        const { employees, user } = get();
        const existing = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          return { success: false, error: 'An employee with this email already exists.' };
        }

        const token = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
        const newEmpId = `emp-${Date.now()}`;
        const code = employeeIdCode || `EMP-${Math.floor(100 + Math.random() * 900)}`;

        const newEmployee: Employee = {
          id: newEmpId,
          name,
          email,
          phone,
          employeeIdCode: code,
          role,
          accountStatus: 'PENDING_INVITATION',
          companyId: user?.companyId || 'comp-001',
          warehouseId,
          warehouseName,
          department,
          designation,
          jobTitle: designation,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          invitationToken: token,
          invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          employees: [newEmployee, ...state.employees],
        }));

        get().addAuditLog(
          'EMPLOYEE_INVITED',
          newEmpId,
          name,
          `Invited employee ${name} (${email}) as ${role} in ${department}. Token: ${token}`
        );

        return { success: true, token };
      },

      activateEmployeeAccount: ({ token, password }) => {
        const { employees } = get();
        const target = employees.find((e) => e.invitationToken === token);

        if (!target) {
          return { success: false, error: 'Invalid or expired activation token. Please request a new invitation.' };
        }

        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.invitationToken === token
              ? {
                  ...emp,
                  accountStatus: 'ACTIVE',
                  invitationToken: undefined,
                  invitationExpiresAt: undefined,
                  lastLoginAt: new Date().toISOString(),
                }
              : emp
          ),
        }));

        get().addAuditLog(
          'INVITATION_ACCEPTED',
          target.id,
          target.name,
          `Employee ${target.name} accepted invitation and activated account.`
        );

        return { success: true };
      },

      updateEmployeeStatus: (employeeId, status) => {
        const { employees } = get();
        const target = employees.find((e) => e.id === employeeId);
        if (!target) return;

        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employeeId ? { ...e, accountStatus: status } : e
          ),
        }));

        get().addAuditLog(
          `EMPLOYEE_STATUS_${status}`,
          employeeId,
          target.name,
          `Employee ${target.name} status updated to ${status}.`
        );
      },

      updateEmployeeDetails: (employeeId, details) => {
        const { roles } = get();
        set((state) => ({
          employees: state.employees.map((e) => {
            if (e.id === employeeId) {
              const updated = { ...e, ...details };
              // If current user is modified, refresh permissions
              if (state.user?.id === employeeId && details.role) {
                const roleRecord = roles.find((r) => r.code === details.role);
                const resolvedPermissions = roleRecord ? roleRecord.permissions : DEFAULT_ROLE_PERMISSIONS[details.role] || [];
                state.user = { ...state.user, role: details.role, permissions: resolvedPermissions };
              }
              return updated;
            }
            return e;
          }),
        }));
      },

      deleteEmployee: (employeeId) => {
        const { employees } = get();
        const target = employees.find((e) => e.id === employeeId);
        if (!target) return;

        set((state) => ({
          employees: state.employees.filter((e) => e.id !== employeeId),
        }));

        get().addAuditLog(
          'EMPLOYEE_DELETED',
          employeeId,
          target.name,
          `Employee record for ${target.name} was deleted.`
        );
      },

      // Custom Roles Management
      createRole: ({ name, description, permissions }) => {
        const { roles, user } = get();
        const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        const existing = roles.find((r) => r.code === code || r.name.toLowerCase() === name.toLowerCase());

        if (existing) {
          return { success: false, error: 'A role with this name or code already exists in your workspace.' };
        }

        const newRole: CustomRoleRecord = {
          id: `role-${Date.now()}`,
          companyId: user?.companyId || 'comp-001',
          name,
          code,
          description,
          isDefault: false,
          permissions,
          assignedUsersCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          roles: [...state.roles, newRole],
        }));

        get().addAuditLog(
          'ROLE_CREATED',
          newRole.id,
          name,
          `Created custom role ${name} with ${permissions.length} granted permissions.`
        );

        return { success: true };
      },

      updateRole: (roleId, { name, description, permissions }) => {
        const { roles, user } = get();
        const target = roles.find((r) => r.id === roleId);
        if (!target) return { success: false, error: 'Role not found.' };

        set((state) => {
          const updatedRoles = state.roles.map((r) =>
            r.id === roleId
              ? {
                  ...r,
                  name: name || r.name,
                  description: description !== undefined ? description : r.description,
                  permissions: permissions !== undefined ? permissions : r.permissions,
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : r
          );

          // If current logged-in user is on this role, update their active session permissions dynamically!
          let updatedUser = state.user;
          if (state.user && state.user.role === target.code && permissions !== undefined) {
            updatedUser = { ...state.user, permissions };
          }

          return { roles: updatedRoles, user: updatedUser };
        });

        get().addAuditLog(
          'ROLE_UPDATED',
          roleId,
          target.name,
          `Role ${target.name} permissions updated.`
        );

        return { success: true };
      },

      duplicateRole: (roleId, newName) => {
        const { roles, user } = get();
        const source = roles.find((r) => r.id === roleId);
        if (!source) return { success: false };

        const name = newName || `${source.name} (Copy)`;
        const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');

        const newRole: CustomRoleRecord = {
          id: `role-${Date.now()}`,
          companyId: user?.companyId || 'comp-001',
          name,
          code,
          description: `Duplicated from ${source.name}`,
          isDefault: false,
          permissions: [...source.permissions],
          assignedUsersCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          roles: [...state.roles, newRole],
        }));

        get().addAuditLog(
          'ROLE_DUPLICATED',
          newRole.id,
          name,
          `Duplicated role ${source.name} into ${name}.`
        );

        return { success: true, newRole };
      },

      deleteRole: (roleId) => {
        const { roles, employees } = get();
        const target = roles.find((r) => r.id === roleId);
        if (!target) return { success: false, error: 'Role not found.' };

        if (target.isDefault) {
          return { success: false, error: 'System default roles cannot be deleted.' };
        }

        const isAssigned = employees.some((e) => e.role === target.code);
        if (isAssigned) {
          return { success: false, error: 'Cannot delete role because one or more active employees are currently assigned to it.' };
        }

        set((state) => ({
          roles: state.roles.filter((r) => r.id !== roleId),
        }));

        get().addAuditLog(
          'ROLE_DELETED',
          roleId,
          target.name,
          `Custom role ${target.name} was deleted.`
        );

        return { success: true };
      },

      addAuditLog: (action, targetUser, targetUserName, details) => {
        const currentUser = get().user;
        const newLog: AuditLogRecord = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleString(),
          performedBy: currentUser?.id || 'sys-admin',
          performedByName: currentUser?.name || 'System Admin',
          companyId: currentUser?.companyId || 'comp-001',
          targetUser,
          targetUserName,
          action,
          details,
          ipAddress: '127.0.0.1',
        };

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs],
        }));
      },
    }),
    {
      name: 'sankaj-auth-storage',
    }
  )
);

export type MockUser = AuthUser;
