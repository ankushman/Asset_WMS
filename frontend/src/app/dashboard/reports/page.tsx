'use client';

import React from 'react';
import { BarChart3, FileSpreadsheet, FileText, Download, Box, Warehouse, Package, Truck, Send, Users } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useAuthStore } from '@/store/useAuthStore';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export-utils';

export default function ReportsPage() {
  const { assets } = useAssetStore();
  const { warehouses } = useWarehouseStore();
  const { items: inventoryItems } = useInventoryStore();
  const { inboundShipments, outboundOrders } = useWorkflowStore();
  const { hasPermission } = useAuthStore();

  const handleExportAssets = (format: 'pdf' | 'excel' | 'csv') => {
    const data = assets.map((a) => ({
      AssetID: a.assetCustomId,
      Name: a.name,
      Category: a.category,
      SerialNumber: a.serialNumber,
      Warehouse: a.warehouseName,
      Condition: a.condition,
      Cost: a.purchaseCost,
    }));

    if (format === 'csv') exportToCSV('Asset_Master_Report', data);
    else if (format === 'excel') exportToExcel('Asset_Master_Report', data);
    else {
      exportToPDF(
        'Asset Master Audit Report',
        ['Asset ID', 'Name', 'Category', 'Serial No', 'Warehouse', 'Condition', 'Cost (₹)'],
        assets.map((a) => [a.assetCustomId, a.name, a.category, a.serialNumber, a.warehouseName, a.condition, a.purchaseCost])
      );
    }
  };

  const handleExportInventory = (format: 'pdf' | 'excel' | 'csv') => {
    const data = inventoryItems.map((i) => ({
      SKU: i.sku,
      Product: i.productName,
      Category: i.category,
      Available: i.available,
      Reserved: i.reserved,
      Warehouse: i.warehouseName,
      Location: `R-${i.rack}/S-${i.shelf}/B-${i.bin}`,
      Status: i.status,
    }));

    if (format === 'csv') exportToCSV('Inventory_Stock_Report', data);
    else if (format === 'excel') exportToExcel('Inventory_Stock_Report', data);
    else {
      exportToPDF(
        'Inventory Stock Audit Report',
        ['SKU', 'Product Name', 'Category', 'Available', 'Reserved', 'Warehouse', 'Location', 'Status'],
        inventoryItems.map((i) => [i.sku, i.productName, i.category, i.available, i.reserved, i.warehouseName, `R-${i.rack}/S-${i.shelf}/B-${i.bin}`, i.status])
      );
    }
  };

  const handleExportWarehouses = (format: 'pdf' | 'excel' | 'csv') => {
    const data = warehouses.map((w) => ({
      Code: w.code,
      Name: w.name,
      City: w.city,
      State: w.state,
      Capacity: w.capacity,
      Occupancy: `${w.occupancy}%`,
      WorkingHours: w.workingHours,
      Status: w.status,
    }));

    if (format === 'csv') exportToCSV('Warehouse_Capacity_Report', data);
    else if (format === 'excel') exportToExcel('Warehouse_Capacity_Report', data);
    else {
      exportToPDF(
        'Warehouse Capacity & Network Report',
        ['Code', 'Name', 'City', 'State', 'Capacity', 'Occupancy', 'Hours', 'Status'],
        warehouses.map((w) => [w.code, w.name, w.city, w.state, w.capacity, `${w.occupancy}%`, w.workingHours, w.status])
      );
    }
  };

  const handleExportInbound = (format: 'pdf' | 'excel' | 'csv') => {
    const data = inboundShipments.map((s) => ({
      Code: s.shipmentCode,
      Supplier: s.supplierName,
      Vehicle: s.vehicleNumber,
      Dock: s.dockNumber,
      Items: s.totalItems,
      Warehouse: s.warehouseName,
      Status: s.status,
    }));

    if (format === 'csv') exportToCSV('Inbound_Receiving_Report', data);
    else if (format === 'excel') exportToExcel('Inbound_Receiving_Report', data);
    else {
      exportToPDF(
        'Inbound Receiving Audit Log',
        ['Code', 'Supplier', 'Vehicle', 'Dock', 'Volume', 'Warehouse', 'Status'],
        inboundShipments.map((s) => [s.shipmentCode, s.supplierName, s.vehicleNumber, s.dockNumber, s.totalItems, s.warehouseName, s.status])
      );
    }
  };

  const reportsList = [
    {
      title: 'Asset Master & EAM Report',
      description: 'Complete audit details for all tracked equipment, serials, and warranty expiries.',
      icon: <Box className="w-5 h-5 text-royal-500" />,
      count: `${assets.length} Assets Registered`,
      exportFn: handleExportAssets,
    },
    {
      title: 'Inventory Stock & Bin Register',
      description: 'SKU quantities, available/reserved levels, and bin location mappings.',
      icon: <Package className="w-5 h-5 text-indigo-500" />,
      count: `${inventoryItems.length} SKUs Tracked`,
      exportFn: handleExportInventory,
    },
    {
      title: 'Warehouse Capacity & Occupancy Report',
      description: 'Multi-facility occupancy rates, rental costs, and working hour configurations.',
      icon: <Warehouse className="w-5 h-5 text-emerald-500" />,
      count: `${warehouses.length} Facilities Active`,
      exportFn: handleExportWarehouses,
    },
    {
      title: 'Inbound Operations & GRN Log',
      description: '9-step vehicle receiving pipeline, vehicle numbers, dock allocations, and item counts.',
      icon: <Truck className="w-5 h-5 text-cyan-500" />,
      count: `${inboundShipments.length} Shipments Logged`,
      exportFn: handleExportInbound,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-royal-600 dark:text-royal-400" />
          Enterprise Reports & Audit Export Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate confidential enterprise audit reports with 1-click export to PDF, Excel (.xlsx), and CSV formats.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((r, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {r.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
                  <span className="text-[10px] font-mono text-royal-600 dark:text-royal-400 font-semibold">
                    {r.count}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {r.description}
              </p>
            </div>

            {/* Export Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => r.exportFn('pdf')}
                className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" /> Export PDF
              </button>
              <button
                onClick={() => r.exportFn('excel')}
                className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Excel (.xlsx)
              </button>
              <button
                onClick={() => r.exportFn('csv')}
                className="py-2 px-3 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
