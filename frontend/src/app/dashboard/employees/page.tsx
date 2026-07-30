'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore, Employee, UserAccountStatus } from '@/store/useAuthStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { UserRole } from '@/lib/rbac';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  Warehouse,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Lock,
} from 'lucide-react';

const DEPARTMENT_OPTIONS = [
  'Executive Operations',
  'Corporate Strategy',
  'Warehouse Operations',
  'Inventory Control',
  'Inbound Receiving',
  'Outbound Dispatch',
  'Logistics & Fleet',
  'Quality & Inspection',
  'IT & WMS Engineering',
  'Safety & Compliance',
];

export default function EmployeesPage() {
  const { employees, user, inviteEmployee, updateEmployeeStatus, deleteEmployee } = useAuthStore();
  const { warehouses } = useWarehouseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Invite Employee Drawer State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteEmpCode, setInviteEmpCode] = useState('');
  const [inviteDept, setInviteDept] = useState(DEPARTMENT_OPTIONS[2]);
  const [inviteDesignation, setInviteDesignation] = useState('Warehouse Supervisor');
  const [inviteWarehouseId, setInviteWarehouseId] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('SUPERVISOR');
  const [inviteError, setInviteError] = useState('');
  const [generatedLinkToken, setGeneratedLinkToken] = useState<string | null>(null);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeIdCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptFilter === 'ALL' || emp.department === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || emp.accountStatus === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');

    const targetWh = warehouses.find((w) => w.id === inviteWarehouseId);

    const res = inviteEmployee({
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone,
      employeeIdCode: inviteEmpCode || undefined,
      department: inviteDept,
      designation: inviteDesignation,
      warehouseId: inviteWarehouseId || undefined,
      warehouseName: targetWh ? targetWh.name : undefined,
      role: inviteRole,
    });

    if (res.success && res.token) {
      setGeneratedLinkToken(res.token);
    } else {
      setInviteError(res.error || 'Failed to send invitation.');
    }
  };

  const closeInviteDrawer = () => {
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteEmpCode('');
    setGeneratedLinkToken(null);
    setInviteError('');
  };

  const getStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active
          </span>
        );
      case 'PENDING_INVITATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" /> Pending Activation
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Suspended
          </span>
        );
      case 'DEACTIVATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <XCircle className="w-3 h-3 text-slate-500" /> Deactivated
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Employee Management Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage company employee roster, send secure invitations, update account statuses, and assign warehouse roles.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white font-bold text-xs shadow-lg shadow-royal-900/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Invite Employee
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, ID, or designation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Department:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_INVITATION">Pending Activation</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-4 py-4">Employee ID</th>
                <th className="px-4 py-4">Department & Role</th>
                <th className="px-4 py-4">Assigned Facility</th>
                <th className="px-4 py-4">Account Status</th>
                <th className="px-4 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No employees found matching the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800 flex-shrink-0"
                        />
                        <div>
                          <Link
                            href={`/dashboard/employees/${emp.id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-royal-600 dark:hover:text-royal-400 transition-colors"
                          >
                            {emp.name}
                          </Link>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                      {emp.employeeIdCode}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{emp.designation}</div>
                      <div className="text-[10px] text-slate-400">{emp.department} • <strong className="text-royal-600 dark:text-royal-400 font-mono">{emp.role}</strong></div>
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {emp.warehouseName ? (
                        <span className="flex items-center gap-1 text-slate-900 dark:text-slate-200 font-medium">
                          <Warehouse className="w-3 h-3 text-royal-500" /> {emp.warehouseName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">All Facilities</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {getStatusBadge(emp.accountStatus)}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-slate-500 font-mono">
                      {emp.lastLoginAt ? new Date(emp.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/employees/${emp.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-royal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Status Toggle Actions */}
                        {emp.accountStatus === 'ACTIVE' && (
                          <button
                            onClick={() => updateEmployeeStatus(emp.id, 'SUSPENDED')}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                            title="Suspend Employee Account"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}

                        {emp.accountStatus === 'SUSPENDED' && (
                          <button
                            onClick={() => updateEmployeeStatus(emp.id, 'ACTIVE')}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Reactivate Employee Account"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Super Admin Delete Option */}
                        {user?.role === 'SUPER_ADMIN' && emp.id !== user.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete employee record for ${emp.name}?`)) {
                                deleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Employee Record (Super Admin Only)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>
            Showing <strong>{paginatedEmployees.length}</strong> of <strong>{filteredEmployees.length}</strong> employees
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Employee Slide-Over Drawer Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-royal-600 dark:text-royal-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Invite Corporate Employee
                  </h2>
                </div>
                <button
                  onClick={closeInviteDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {generatedLinkToken ? (
                <div className="mt-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Invitation Sent Successfully!
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      A pending employee account was created for <strong>{inviteEmail}</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-mono break-all space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">EMPLOYEE ACTIVATION LINK</span>
                    <a
                      href={`/activate?token=${generatedLinkToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-royal-600 dark:text-royal-400 underline font-bold"
                    >
                      {typeof window !== 'undefined' ? window.location.origin : ''}/activate?token={generatedLinkToken}
                    </a>
                  </div>

                  <button
                    onClick={closeInviteDrawer}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
                  >
                    Done & Return to List
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="mt-6 space-y-4 text-xs font-medium">
                  {inviteError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {inviteError}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Vikramaditya Rao"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Corporate Work Email <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="v.rao@sankajlogistics.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Mobile Number <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Employee ID Code <span className="text-slate-400 font-normal">(Optional - auto-generated if blank)</span></label>
                    <input
                      type="text"
                      value={inviteEmpCode}
                      onChange={(e) => setInviteEmpCode(e.target.value)}
                      placeholder="e.g. EMP-SUP-014"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-royal-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Department</label>
                      <select
                        value={inviteDept}
                        onChange={(e) => setInviteDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs cursor-pointer"
                      >
                        {DEPARTMENT_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                      <input
                        type="text"
                        value={inviteDesignation}
                        onChange={(e) => setInviteDesignation(e.target.value)}
                        placeholder="e.g. Senior Shift Supervisor"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Assigned Facility / Warehouse</label>
                    <select
                      value={inviteWarehouseId}
                      onChange={(e) => setInviteWarehouseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs cursor-pointer"
                    >
                      <option value="">All Facilities / Corporate HQ</option>
                      {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>{wh.name} ({wh.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">RBAC System Access Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-royal-600 dark:text-royal-400 font-bold text-xs focus:outline-none focus:border-royal-500 cursor-pointer"
                    >
                      <option value="COMPANY_ADMIN">Company Admin (Full Scope)</option>
                      <option value="WAREHOUSE_MANAGER">Warehouse Manager (Facility Scope)</option>
                      <option value="SUPERVISOR">Supervisor (Ops Control)</option>
                      <option value="INVENTORY_EXECUTIVE">Inventory Executive (Stock Master)</option>
                      <option value="PICKER">Picker (Dispatch Console)</option>
                      <option value="PACKER">Packer (Packing Console)</option>
                      <option value="VIEWER">Read-Only Viewer</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white font-bold text-xs shadow-lg shadow-royal-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Send Invitation & Generate Token
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
