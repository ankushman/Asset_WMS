'use client';

import React, { useState } from 'react';
import {
  Box,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  QrCode,
  Barcode as BarcodeIcon,
  Wrench,
  User,
  History,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { MockAsset } from '@/lib/mock-data';
import { BarcodeQRGenerator } from '@/components/barcode/BarcodeQRGenerator';
import { generateNextAssetId } from '@/lib/asset-utils';

export default function AssetsPage() {
  const { assets, histories, addAsset, updateAsset, deleteAsset } = useAssetStore();
  const { warehouses } = useWarehouseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewLabelAsset, setViewLabelAsset] = useState<MockAsset | null>(null);
  const [viewHistoryAsset, setViewHistoryAsset] = useState<MockAsset | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [assetCustomId, setAssetCustomId] = useState('');
  const [category, setCategory] = useState('Forklift');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2025-01-15');
  const [purchaseCost, setPurchaseCost] = useState(150000);
  const [vendor, setVendor] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('2027-01-15');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-001');
  const [assignedEmployeeName, setAssignedEmployeeName] = useState('');
  const [condition, setCondition] = useState<'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DISPOSED'>('AVAILABLE');
  const [image, setImage] = useState('');

  const categories = [
    'Forklift',
    'Scanner',
    'Printer',
    'Laptop',
    'Desktop',
    'Generator',
    'Camera',
    'Tools',
    'Furniture',
    'Other',
  ];

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetCustomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesCond = selectedCondition === 'ALL' || a.condition === selectedCondition;
    return matchesSearch && matchesCat && matchesCond;
  });

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (!editingId) {
      const generatedId = generateNextAssetId(newCat, assets);
      setAssetCustomId(generatedId);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    const initialCat = 'Forklift';
    setCategory(initialCat);
    const autoAssetId = generateNextAssetId(initialCat, assets);
    setAssetCustomId(autoAssetId);
    setName('');
    setSerialNumber(`SN-TYT-${Date.now().toString().slice(-6)}`);
    setPurchaseDate('2025-01-15');
    setPurchaseCost(150000);
    setVendor('Toyota Material Handling');
    setWarrantyExpiry('2027-01-15');
    setWarehouseId(warehouses[0]?.id || 'wh-001');
    setAssignedEmployeeName('');
    setCondition('AVAILABLE');
    setImage('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: MockAsset) => {
    setEditingId(a.id);
    setAssetCustomId(a.assetCustomId);
    setName(a.name);
    setCategory(a.category);
    setSerialNumber(a.serialNumber);
    setPurchaseDate(a.purchaseDate);
    setPurchaseCost(a.purchaseCost);
    setVendor(a.vendor);
    setWarrantyExpiry(a.warrantyExpiry);
    setWarehouseId(a.warehouseId);
    setAssignedEmployeeName(a.assignedEmployeeName || '');
    setCondition(a.condition);
    setImage(a.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === warehouseId);
    if (editingId) {
      updateAsset(editingId, {
        name,
        category,
        serialNumber,
        purchaseDate,
        purchaseCost: Number(purchaseCost),
        vendor,
        warrantyExpiry,
        warehouseId,
        warehouseName: wh?.name || 'Mumbai Central Hub',
        assignedEmployeeName,
        condition,
        image,
      });
    } else {
      const finalAssetId = assetCustomId || generateNextAssetId(category, assets);
      addAsset({
        assetCustomId: finalAssetId,
        name,
        category,
        barcode: `BC-${finalAssetId}`,
        qrCode: `QR-${finalAssetId}`,
        serialNumber,
        purchaseDate,
        purchaseCost: Number(purchaseCost),
        vendor,
        warrantyExpiry,
        warehouseId,
        warehouseName: wh?.name || 'Mumbai Central Hub',
        assignedEmployeeName,
        condition,
        image: image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Enterprise Asset Master & EAM Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track forklifts, barcode scanners, generators, and IT equipment with QR code generation and audit history.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by asset ID, name, or serial number..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Conditions</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="IN_USE">IN_USE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="DISPOSED">DISPOSED</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Asset Image Header */}
              <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
                <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-mono font-bold text-[11px] border border-white/20">
                  {asset.assetCustomId}
                </span>
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase shadow-md ${
                    asset.condition === 'AVAILABLE'
                      ? 'bg-emerald-500 text-white'
                      : asset.condition === 'IN_USE'
                      ? 'bg-royal-500 text-white'
                      : asset.condition === 'MAINTENANCE'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {asset.condition.replace('_', ' ')}
                </span>
              </div>

              {/* Body Metadata */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Category: <strong className="text-slate-700 dark:text-slate-200">{asset.category}</strong>
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Serial No:</span>
                    <span className="font-mono font-semibold">{asset.serialNumber}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Facility:</span>
                    <span className="font-semibold text-royal-600 dark:text-royal-400">{asset.warehouseName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Assigned To:</span>
                    <span className="font-semibold">{asset.assignedEmployeeName || 'Unassigned'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Warranty Expiry:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{asset.warrantyExpiry}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewLabelAsset(asset)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                >
                  <BarcodeIcon className="w-3.5 h-3.5 text-royal-600" /> Barcode/QR
                </button>
                <button
                  onClick={() => setViewHistoryAsset(asset)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-royal-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                  title="View Audit History"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(asset)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-royal-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteAsset(asset.id)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barcode / QR Code Modal */}
      {viewLabelAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Asset QR & Barcode Label
              </h3>
              <button
                onClick={() => setViewLabelAsset(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <BarcodeQRGenerator
              code={viewLabelAsset.barcode}
              title={viewLabelAsset.name}
              subtitle={`ID: ${viewLabelAsset.assetCustomId} | SN: ${viewLabelAsset.serialNumber}`}
              type="barcode"
            />

            <BarcodeQRGenerator
              code={viewLabelAsset.qrCode}
              title="QR Matrix Code"
              subtitle={viewLabelAsset.warehouseName}
              type="qrcode"
            />
          </div>
        </div>
      )}

      {/* Asset Audit History Modal */}
      {viewHistoryAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-royal-600" />
                Asset Lifecycle Audit History
              </h3>
              <button
                onClick={() => setViewHistoryAsset(null)}
                className="text-xs font-bold text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
              {histories
                .filter((h) => h.assetId === viewHistoryAsset.id)
                .map((h) => (
                  <div key={h.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{h.actionType}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{h.createdAt.split('T')[0]}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{h.description}</p>
                    <span className="text-[10px] text-royal-600 dark:text-royal-400 font-semibold block mt-1">
                      By: {h.performedBy}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Asset Details' : 'Register New Enterprise Asset'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset ID <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">(Auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    value={assetCustomId}
                    readOnly
                    tabIndex={-1}
                    placeholder="AST-FORK-001"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono font-bold cursor-not-allowed select-none shadow-inner"
                    title="Asset ID is automatically generated based on the selected category"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Toyota 3-Ton Heavy Forklift"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="IN_USE">IN_USE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="DISPOSED">DISPOSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="SN-TYT-90412"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Warehouse</label>
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
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Employee</label>
                  <input
                    type="text"
                    value={assignedEmployeeName}
                    onChange={(e) => setAssignedEmployeeName(e.target.value)}
                    placeholder="Priya Sundaram"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
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
                  className="px-4 py-2 font-semibold text-white bg-royal-600 rounded-xl hover:bg-royal-700 shadow-md"
                >
                  Save Asset Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
