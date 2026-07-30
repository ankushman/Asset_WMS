'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  Barcode as BarcodeIcon,
  Layers,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { MockInventoryItem } from '@/lib/mock-data';
import { BarcodeQRGenerator } from '@/components/barcode/BarcodeQRGenerator';

export default function InventoryPage() {
  const { items, addItem, updateItem, deleteItem, adjustStock } = useInventoryStore();
  const { warehouses } = useWarehouseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewLabelItem, setViewLabelItem] = useState<MockInventoryItem | null>(null);

  // Form state
  const [sku, setSku] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Packaging Materials');
  const [brand, setBrand] = useState('PackShield');
  const [batchNumber, setBatchNumber] = useState('BATCH-2026-A1');
  const [available, setAvailable] = useState(1000);
  const [reserved, setReserved] = useState(100);
  const [damaged, setDamaged] = useState(0);
  const [minStock, setMinStock] = useState(200);
  const [maxStock, setMaxStock] = useState(3000);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-001');
  const [rack, setRack] = useState('R-01');
  const [shelf, setShelf] = useState('S-01');
  const [bin, setBin] = useState('B-01');
  const [supplier, setSupplier] = useState('Supreme Polymers Ltd.');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWh = selectedWarehouse === 'ALL' || item.warehouseId === selectedWarehouse;
    const matchesStat = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesWh && matchesStat;
  });

  const lowStockAlerts = items.filter((i) => i.status === 'LOW_STOCK' || i.available <= i.minStock);

  const handleOpenAdd = () => {
    setEditingId(null);
    setSku(`SKU-AST-${Math.floor(1000 + Math.random() * 9000)}`);
    setProductName('');
    setCategory('Packaging Materials');
    setBrand('PackShield Enterprise');
    setBatchNumber(`BATCH-2026-B${items.length + 1}`);
    setAvailable(500);
    setReserved(50);
    setDamaged(0);
    setMinStock(150);
    setMaxStock(2000);
    setWarehouseId(warehouses[0]?.id || 'wh-001');
    setRack('R-04');
    setShelf('S-02');
    setBin('B-10');
    setSupplier('Supreme Polymers Ltd.');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (i: MockInventoryItem) => {
    setEditingId(i.id);
    setSku(i.sku);
    setProductName(i.productName);
    setCategory(i.category);
    setBrand(i.brand);
    setBatchNumber(i.batchNumber);
    setAvailable(i.available);
    setReserved(i.reserved);
    setDamaged(i.damaged);
    setMinStock(i.minStock);
    setMaxStock(i.maxStock);
    setWarehouseId(i.warehouseId);
    setRack(i.rack);
    setShelf(i.shelf);
    setBin(i.bin);
    setSupplier(i.supplier);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === warehouseId);
    const total = Number(available) + Number(reserved) + Number(damaged);
    const statusVal = available <= 0 ? 'OUT_OF_STOCK' : available <= minStock ? 'LOW_STOCK' : 'IN_STOCK';

    if (editingId) {
      updateItem(editingId, {
        sku,
        productName,
        category,
        brand,
        batchNumber,
        quantity: total,
        available: Number(available),
        reserved: Number(reserved),
        damaged: Number(damaged),
        minStock: Number(minStock),
        maxStock: Number(maxStock),
        warehouseId,
        warehouseName: wh?.name || 'Mumbai Central Hub',
        rack,
        shelf,
        bin,
        supplier,
        status: statusVal,
      });
    } else {
      addItem({
        sku,
        barcode: `89012345${Math.floor(1000 + Math.random() * 9000)}`,
        qrCode: `QR-${sku}`,
        productName,
        category,
        brand,
        batchNumber,
        quantity: total,
        available: Number(available),
        reserved: Number(reserved),
        damaged: Number(damaged),
        minStock: Number(minStock),
        maxStock: Number(maxStock),
        warehouseId,
        warehouseName: wh?.name || 'Mumbai Central Hub',
        rack,
        shelf,
        bin,
        supplier,
        status: statusVal,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Inventory Control & Stock Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track SKUs down to Rack, Shelf, and Bin locations with batch control and safety stock alerts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Inventory SKU
        </button>
      </div>

      {/* Low Stock Alerts Banner */}
      {lowStockAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-200">Low Stock Warning ({lowStockAlerts.length} SKUs require re-order)</h4>
            <p className="text-amber-300/80 mt-0.5">
              Items below safety stock limit: {lowStockAlerts.map((i) => `${i.productName} (${i.available} available)`).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU code, barcode, or item name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.code} - {w.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">IN_STOCK</option>
            <option value="LOW_STOCK">LOW_STOCK</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      {/* Modern Enterprise Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">SKU & Item Details</th>
                <th className="p-4">Location (Rack/Shelf/Bin)</th>
                <th className="p-4">Warehouse</th>
                <th className="p-4">Available / Reserved</th>
                <th className="p-4">Min / Max Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {item.productName}
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {item.sku}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Brand: {item.brand} | Batch: <span className="font-mono">{item.batchNumber}</span>
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      Rack {item.rack} / {item.shelf} / {item.bin}
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                    {item.warehouseName}
                  </td>

                  <td className="p-4 font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      {item.available}
                    </span>{' '}
                    <span className="text-slate-400 text-[11px]">({item.reserved} res / {item.damaged} dam)</span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-500">
                    Min: {item.minStock} | Max: {item.maxStock}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'IN_STOCK'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'LOW_STOCK'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewLabelItem(item)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Print Barcode Label"
                      >
                        <BarcodeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Label Modal */}
      {viewLabelItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Inventory SKU Barcode & Label
              </h3>
              <button onClick={() => setViewLabelItem(null)} className="text-xs font-bold text-slate-500">
                Close
              </button>
            </div>

            <BarcodeQRGenerator
              code={viewLabelItem.barcode}
              title={viewLabelItem.productName}
              subtitle={`SKU: ${viewLabelItem.sku} | Loc: R-${viewLabelItem.rack}/S-${viewLabelItem.shelf}`}
              type="barcode"
            />
          </div>
        </div>
      )}

      {/* Add / Edit Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Inventory SKU' : 'Register New Inventory SKU'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-EPK-1002"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Pallet Stretch Wrap 500mm"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Qty</label>
                  <input
                    type="number"
                    value={available}
                    onChange={(e) => setAvailable(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reserved Qty</label>
                  <input
                    type="number"
                    value={reserved}
                    onChange={(e) => setReserved(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Damaged Qty</label>
                  <input
                    type="number"
                    value={damaged}
                    onChange={(e) => setDamaged(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rack</label>
                  <input
                    type="text"
                    value={rack}
                    onChange={(e) => setRack(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Shelf</label>
                  <input
                    type="text"
                    value={shelf}
                    onChange={(e) => setShelf(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bin</label>
                  <input
                    type="text"
                    value={bin}
                    onChange={(e) => setBin(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Stock Limit</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Warehouse</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Save Inventory SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
