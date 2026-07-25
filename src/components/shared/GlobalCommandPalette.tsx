'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Box,
  Warehouse,
  Package,
  Users,
  X,
  ArrowRight,
  CornerDownLeft,
  Truck,
  Send,
  Compass,
  BarChart3,
  Settings,
  Clock,
  Command,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAssetStore } from '@/store/useAssetStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { useInventoryStore } from '@/store/useInventoryStore';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Warehouses' | 'Assets' | 'Inventory' | 'Employees' | 'Inbound' | 'Outbound' | 'Transportation' | 'Reports' | 'Settings';
  path: string;
  badge?: string;
  icon: React.ReactNode;
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalCommandPalette({ isOpen, onClose }: GlobalCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { assets } = useAssetStore();
  const { warehouses } = useWarehouseStore();
  const { items: inventoryItems } = useInventoryStore();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate Search Items
  const staticItems: CommandItem[] = [
    { id: 'nav-inbound', title: 'Inbound Receiving Operations', subtitle: '9-step dock to putaway pipeline', category: 'Inbound', path: '/dashboard/inbound', icon: <Truck className="w-4 h-4 text-orange-500" /> },
    { id: 'nav-outbound', title: 'Outbound Dispatch Orders', subtitle: '7-step picking and packing console', category: 'Outbound', path: '/dashboard/outbound', icon: <Send className="w-4 h-4 text-indigo-500" /> },
    { id: 'nav-tms', title: 'Transportation Management (TMS)', subtitle: 'Delivery trips, vehicle fitness, driver tracking', category: 'Transportation', path: '/dashboard/transportation', icon: <Compass className="w-4 h-4 text-sky-500" /> },
    { id: 'nav-reports', title: 'Reports & Export Center', subtitle: 'Download 1-click PDF, Excel, and CSV audits', category: 'Reports', path: '/dashboard/reports', icon: <BarChart3 className="w-4 h-4 text-emerald-500" /> },
    { id: 'nav-users', title: 'User Management & RBAC', subtitle: 'Manage company users and granular roles', category: 'Employees', path: '/dashboard/users', icon: <Users className="w-4 h-4 text-purple-500" /> },
    { id: 'nav-[#settings]', title: 'Security & Access Settings', subtitle: 'Rate limiting and session timeouts', category: 'Settings', path: '/dashboard/security', icon: <Settings className="w-4 h-4 text-slate-500" /> },
  ];

  const assetItems: CommandItem[] = assets.map((a) => ({
    id: `asset-${a.id}`,
    title: a.name,
    subtitle: `${a.assetCustomId} • ${a.category} • ${a.warehouseName}`,
    category: 'Assets',
    path: '/dashboard/assets',
    badge: a.condition,
    icon: <Box className="w-4 h-4 text-orange-500" />,
  }));

  const warehouseItems: CommandItem[] = warehouses.map((w) => ({
    id: `wh-${w.id}`,
    title: w.name,
    subtitle: `${w.code} • ${w.city}, ${w.state} • Occupancy: ${w.occupancy}%`,
    category: 'Warehouses',
    path: '/dashboard/warehouses',
    badge: `${w.occupancy}% Cap`,
    icon: <Warehouse className="w-4 h-4 text-emerald-500" />,
  }));

  const inventorySearchItems: CommandItem[] = inventoryItems.map((i) => ({
    id: `inv-${i.id}`,
    title: i.productName,
    subtitle: `${i.sku} • Rack ${i.rack}/Shelf ${i.shelf} • Avail: ${i.available} units`,
    category: 'Inventory',
    path: '/dashboard/inventory',
    badge: `${i.available} in stock`,
    icon: <Package className="w-4 h-4 text-indigo-500" />,
  }));

  const allItems: CommandItem[] = [
    ...staticItems,
    ...warehouseItems,
    ...assetItems,
    ...inventorySearchItems,
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : staticItems.concat(warehouseItems.slice(0, 2), assetItems.slice(0, 2));

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        navigateTo(filteredItems[selectedIndex].path);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  // Group filtered results by Category
  const groupedCategories = Array.from(new Set(filteredItems.map((item) => item.category)));

  let globalIndexCounter = 0;

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search Warehouses, Assets, SKUs, Trips..."
            className="w-full py-4 text-xs font-semibold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                No matching results found for "{query}"
              </p>
              <p className="text-[11px] text-slate-400">
                Try searching for "Mumbai", "Forklift", "SKU", "Inbound", or "TMS"
              </p>
            </div>
          ) : (
            groupedCategories.map((category) => {
              const categoryItems = filteredItems.filter((item) => item.category === category);
              return (
                <div key={category} className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {category} ({categoryItems.length})
                  </div>

                  {categoryItems.map((item) => {
                    const currentIndex = globalIndexCounter++;
                    const isSelected = currentIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.path)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-l-2 border-orange-500 pl-2'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              {highlightMatch(item.title, query)}
                              {item.badge && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {highlightMatch(item.subtitle, query)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-orange-500" />}
                          <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-500' : 'text-slate-400'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Command Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
            <Command className="w-3.5 h-3.5" /> Ennea Command Engine
          </div>
        </div>
      </div>
    </div>
  );
}
