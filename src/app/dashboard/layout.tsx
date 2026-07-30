'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/shared/DashboardSidebar';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { GlobalCommandPalette } from '@/components/shared/GlobalCommandPalette';
import { useAuthStore } from '@/store/useAuthStore';
import { canAccessPath } from '@/lib/rbac';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Global Ctrl + K / Cmd + K keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const hasAccess = user ? canAccessPath(user.permissions, pathname) : true;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] text-[#111827] dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {!hasAccess ? (
            <div className="p-8 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
              <ShieldAlert className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
                Access Restricted (RBAC Policy Enforcement)
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Your role (<strong className="font-mono">{user?.role}</strong>) does not have permission to view <code className="font-mono">{pathname}</code>.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm"
              >
                Return to Overview
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K / Cmd+K) */}
      <GlobalCommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
