'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/lib/rbac';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  LogOut,
  CheckCircle2,
  Building2,
  Warehouse,
  HardHat,
  ClipboardList,
  ShoppingCart,
  Box,
  Eye,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { GlobalCommandPalette } from './GlobalCommandPalette';
import { NotificationBell } from '../workflows/NotificationBell';

const ROLES_LIST: { role: UserRole; label: string; icon: React.ReactNode }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> },
  { role: 'COMPANY_ADMIN', label: 'Company Admin', icon: <Building2 className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager', icon: <Warehouse className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'SUPERVISOR', label: 'Supervisor', icon: <HardHat className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'INVENTORY_EXECUTIVE', label: 'Inventory Executive', icon: <ClipboardList className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'PICKER', label: 'Picker', icon: <ShoppingCart className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'PACKER', label: 'Packer', icon: <Box className="w-3.5 h-3.5 text-slate-500" /> },
  { role: 'VIEWER', label: 'Read-Only Viewer', icon: <Eye className="w-3.5 h-3.5 text-slate-500" /> },
];

export function DashboardHeader() {
  const router = useRouter();
  const { user, originalRole, impersonatedRole, impersonateRole, exitImpersonation, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin = originalRole === 'SUPER_ADMIN';

  const notifications = [
    { id: '1', title: 'SLA Breach Highlight', message: 'Delhi Hub Same-Day Dispatch delay (+1.2h)', time: '10m ago', unread: true },
    { id: '2', title: 'Low Inventory Alert', message: 'Honeywell Barcode Scanner below min level', time: '1h ago', unread: true },
    { id: '3', title: 'MHE Maintenance Due', message: 'Jungheinrich Electric Stacker battery at 18%', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const currentRoleConfig = ROLES_LIST.find((r) => r.role === (user?.role || originalRole)) || ROLES_LIST[0];

  return (
    <>
      {/* Impersonation Banner for Super Admin */}
      {impersonatedRole && (
        <div className="bg-orange-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 animate-pulse" />
            <span>
              Impersonation Active: Viewing application as <strong>{currentRoleConfig.label}</strong>.
            </span>
          </div>
          <button
            onClick={exitImpersonation}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-orange-700 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 shadow-xs"
          >
            <X className="w-3.5 h-3.5" /> Return to Super Admin
          </button>
        </div>
      )}

      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Search Trigger */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search assets, warehouses, SKU...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Role Display: Interactive Dropdown ONLY for Super Admin, Static Badge for Others */}
          {isSuperAdmin ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>
                  {impersonatedRole ? `Previewing: ${currentRoleConfig.label}` : '🛡 Super Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Role Impersonation (Super Admin Only)
                  </div>
                  {ROLES_LIST.map(({ role, label, icon }) => (
                    <button
                      key={role}
                      onClick={() => {
                        impersonateRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        (impersonatedRole || originalRole) === role
                          ? 'font-bold text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        <span>{label}</span>
                      </div>
                      {(impersonatedRole || originalRole) === role && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Static Role Badge for Non-Super Admins */
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 select-none">
              {currentRoleConfig.icon}
              <span>{currentRoleConfig.label}</span>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )
            ) : (
              <Moon className="w-4 h-4 text-slate-600 opacity-0" />
            )}
          </button>

          {/* Real-time Workflow Notification Bell */}
          <NotificationBell />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Super Admin'}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{user?.role}</div>
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileDropdownOpen(false);
                    router.push('/login');
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out Platform
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalCommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
