'use client';

import React, { useState } from 'react';
import { useAuthStore, CustomRoleRecord } from '@/store/useAuthStore';
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from '@/lib/rbac';
import {
  ShieldCheck,
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  X,
  Lock,
  Users,
  CheckSquare,
  Square,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function RolesAndPermissionsPage() {
  const { roles, createRole, updateRole, duplicateRole, deleteRole, user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRoleRecord | null>(null);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions(['dashboard.view', 'report.view']);
    setFormError('');
    setFormSuccess('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (role: CustomRoleRecord) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setSelectedPermissions(role.permissions || []);
    setFormError('');
    setFormSuccess('');
    setIsDrawerOpen(true);
  };

  const handleDuplicate = (role: CustomRoleRecord) => {
    const res = duplicateRole(role.id);
    if (res.success && res.newRole) {
      handleOpenEdit(res.newRole);
    }
  };

  const handleDelete = (role: CustomRoleRecord) => {
    if (role.isDefault) {
      alert('System default roles cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete custom role "${role.name}"?`)) {
      const res = deleteRole(role.id);
      if (!res.success) {
        alert(res.error || 'Failed to delete role.');
      }
    }
  };

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const toggleModulePermissions = (modulePermissions: string[]) => {
    const allSelected = modulePermissions.every((code) => selectedPermissions.includes(code));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((code) => !modulePermissions.includes(code)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...modulePermissions])));
    }
  };

  const toggleSelectAllGlobal = () => {
    if (selectedPermissions.length === ALL_PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(ALL_PERMISSIONS.map((p) => p.code));
    }
  };

  const toggleModuleCollapse = (moduleName: string) => {
    setCollapsedModules((prev) => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (selectedPermissions.length === 0) {
      setFormError('Please select at least one permission for this role.');
      return;
    }

    if (editingRole) {
      const res = updateRole(editingRole.id, {
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions,
      });

      if (res.success) {
        setFormSuccess('Role permissions updated successfully!');
        setTimeout(() => setIsDrawerOpen(false), 1500);
      } else {
        setFormError(res.error || 'Failed to update role.');
      }
    } else {
      const res = createRole({
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions,
      });

      if (res.success) {
        setFormSuccess('Custom role created successfully!');
        setTimeout(() => setIsDrawerOpen(false), 1500);
      } else {
        setFormError(res.error || 'Failed to create role.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Roles & Permissions Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure granular, module-level action permissions across 17 enterprise roles & custom company roles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white font-bold text-xs shadow-lg shadow-royal-900/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
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
            placeholder="Search role name, code, or description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
          />
        </div>

        <div className="text-slate-500 text-xs flex items-center gap-4">
          <span>Total Catalog Permissions: <strong className="text-royal-600 dark:text-royal-400 font-mono">{ALL_PERMISSIONS.length} Actions</strong></span>
          <span>Defined Roles: <strong className="text-slate-900 dark:text-white font-mono">{roles.length}</strong></span>
        </div>
      </div>

      {/* Roles Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:border-royal-500/50 hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    {role.name}
                  </h3>
                  <span className="font-mono text-[10px] text-royal-600 dark:text-royal-400 font-bold bg-royal-50 dark:bg-royal-950/60 px-2 py-0.5 rounded border border-royal-200 dark:border-royal-800">
                    {role.code}
                  </span>
                </div>
                {role.isDefault ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> System Default
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Custom Role
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[36px]">
                {role.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PERMISSIONS</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {role.permissions ? role.permissions.length : 0} <span className="text-[10px] text-slate-400 font-normal">/ {ALL_PERMISSIONS.length}</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">USERS ASSIGNED</span>
                  <span className="text-sm font-extrabold text-royal-600 dark:text-royal-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {role.assignedUsersCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-slate-400">Updated {role.updatedAt}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDuplicate(role)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-royal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Duplicate Role"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenEdit(role)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-royal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Role & Permissions"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {!role.isDefault && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Creation / Editing Slide-Over Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl p-6 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-royal-600 dark:text-royal-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Enterprise Role'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-xs font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Role Title <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. Inbound Gate & Audit Officer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Role Code</label>
                    <input
                      type="text"
                      value={roleName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-xs opacity-75"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Brief summary of duties and permissions granted to this role..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-royal-500 text-xs"
                    />
                  </div>
                </div>

                {/* Module Grouped Checkboxes Header */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Action Permissions ({selectedPermissions.length} / {ALL_PERMISSIONS.length} Granted)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Check individual action capabilities or select entire module blocks.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleSelectAllGlobal}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold text-[11px] cursor-pointer"
                      >
                        {selectedPermissions.length === ALL_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {/* Search Filter Inside Permissions */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder="Filter permission actions (e.g. create, export, gatepass)..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-royal-500"
                    />
                  </div>

                  {/* Collapsible Module Permission Groups */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {PERMISSION_GROUPS.map((group) => {
                      const groupPerms = group.permissions.filter((p) =>
                        p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                        p.code.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                        p.module.toLowerCase().includes(permissionSearch.toLowerCase())
                      );

                      if (groupPerms.length === 0) return null;

                      const groupCodes = group.permissions.map((p) => p.code);
                      const isModuleFullySelected = groupCodes.every((c) => selectedPermissions.includes(c));
                      const isCollapsed = collapsedModules[group.module];

                      return (
                        <div
                          key={group.module}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50"
                        >
                          <div className="p-3 bg-slate-100/70 dark:bg-slate-900/90 flex items-center justify-between font-semibold">
                            <button
                              type="button"
                              onClick={() => toggleModuleCollapse(group.module)}
                              className="flex items-center gap-2 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                            >
                              {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              <span>{group.moduleName}</span>
                              <span className="text-[10px] font-normal text-slate-400">
                                ({groupCodes.filter((c) => selectedPermissions.includes(c)).length}/{groupCodes.length})
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleModulePermissions(groupCodes)}
                              className="text-[11px] text-royal-600 dark:text-royal-400 font-bold hover:underline cursor-pointer"
                            >
                              {isModuleFullySelected ? 'Deselect Module' : 'Select Module'}
                            </button>
                          </div>

                          {!isCollapsed && (
                            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-slate-950">
                              {groupPerms.map((perm) => {
                                const isChecked = selectedPermissions.includes(perm.code);
                                return (
                                  <label
                                    key={perm.code}
                                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                      isChecked
                                        ? 'bg-royal-50/60 dark:bg-royal-950/40 border-royal-300 dark:border-royal-800/80 text-royal-900 dark:text-royal-200'
                                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => togglePermission(perm.code)}
                                      className="mt-0.5 rounded text-royal-600 focus:ring-0 cursor-pointer"
                                    />
                                    <div>
                                      <div className="font-bold text-xs flex items-center gap-1">
                                        <span>{perm.name}</span>
                                      </div>
                                      <span className="font-mono text-[10px] text-slate-400 block">{perm.code}</span>
                                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{perm.description}</p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white font-bold text-xs shadow-lg shadow-royal-900/30 cursor-pointer"
                  >
                    {editingRole ? 'Save Role Changes' : 'Create Custom Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
