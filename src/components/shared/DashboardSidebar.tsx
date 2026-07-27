'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROLE_NAVIGATION, NavItem } from '@/lib/rbac';
import {
  LayoutDashboard,
  Building2,
  Warehouse,
  Box,
  Package,
  Truck,
  Send,
  Users,
  BarChart3,
  ChevronRight,
  Compass,
  UserCheck,
  Wrench,
  Gauge,
  GitCompare,
  DollarSign,
  CheckSquare,
  Hammer,
  FileText,
  Calendar,
  Sparkles,
  Bot,
  TrendingUp,
  Cpu,
  Brain,
  Navigation,
  PieChart,
  Workflow,
  FolderKanban,
  Plug,
  Radio,
  ShieldCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Warehouse: <Warehouse className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Send: <Send className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  GitCompare: <GitCompare className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  Hammer: <Hammer className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  Navigation: <Navigation className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
  Workflow: <Workflow className="w-4 h-4" />,
  FolderKanban: <FolderKanban className="w-4 h-4" />,
  Plug: <Plug className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const role = user?.role || 'SUPER_ADMIN';
  const navItems: NavItem[] = ROLE_NAVIGATION[role] || ROLE_NAVIGATION['SUPER_ADMIN'];

  return (
    <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col border-r border-slate-800 select-none flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-[#111827]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-extrabold text-white text-sm tracking-wider flex-shrink-0">
            S
          </div>
          <div className="leading-tight">
            <div className="font-bold text-xs tracking-wider text-white">
              SANKAJ
            </div>
            <div className="font-semibold text-[10px] text-orange-500 tracking-wider">
              LOGISTICS LIMITED
            </div>
            <div className="text-[9px] text-slate-400 font-medium tracking-tight">
              Enterprise Warehouse Management System
            </div>
          </div>
        </Link>
      </div>

      {/* Role Context Ribbon */}
      <div className="px-4 py-2.5 mx-3 mt-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
          <div className="truncate">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Role</p>
            <p className="text-xs font-semibold text-slate-200 truncate">{role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          System Modules
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-2 border-orange-500 pl-2.5'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-orange-500' : 'text-slate-400'}>
                  {iconMap[item.iconName] || <LayoutDashboard className="w-4 h-4" />}
                </span>
                <span>{item.title}</span>
              </div>
              {item.badge ? (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-slate-200' : 'text-slate-600'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 mx-3 mb-4 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-slate-300">Industrial Suite</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-orange-400 rounded font-mono font-bold">v3.2</span>
        </div>
        <p className="text-[10px] text-slate-500">WMS • EAM • TMS • ERP Integration</p>
      </div>
    </aside>
  );
}
