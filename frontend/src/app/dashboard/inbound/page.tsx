'use client';

import React, { useState } from 'react';
import { Truck, Plus, Search, ChevronRight, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { InboundWorkflowStepper } from '@/components/workflows/InboundWorkflowStepper';

export default function InboundPage() {
  const { inboundShipments, addInboundShipment } = useWorkflowStore();
  const { warehouses } = useWarehouseStore();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(inboundShipments[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [shipmentCode, setShipmentCode] = useState(`INB-2026-00${inboundShipments.length + 1}`);
  const [supplierName, setSupplierName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const selectedShipment = inboundShipments.find((s) => s.id === selectedShipmentId) || inboundShipments[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses[0];
    addInboundShipment({
      shipmentCode,
      supplierName,
      vehicleNumber,
      dockNumber: 'Dock 01',
      totalItems: 500,
      warehouseId: wh?.id || 'wh-001',
      warehouseName: wh?.name || 'Mumbai Central Mega Hub',
      status: 'IN_PROGRESS',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Inbound Logistics & 9-Step Receiving Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vehicle Reporting -&gt; Dock Allocation -&gt; Unload -&gt; Staging -&gt; Inspection -&gt; Counting -&gt; GRN Generation -&gt; Put Away -&gt; Completed.
          </p>
        </div>

        <button
          onClick={() => {
            setShipmentCode(`INB-2026-00${inboundShipments.length + 1}`);
            setSupplierName('');
            setVehicleNumber('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Register Inbound Shipment
        </button>
      </div>

      {/* Shipment Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {inboundShipments.map((shipment) => {
          const isSelected = shipment.id === selectedShipmentId;
          return (
            <button
              key={shipment.id}
              onClick={() => setSelectedShipmentId(shipment.id)}
              className={`p-3.5 rounded-2xl border text-xs font-semibold whitespace-nowrap text-left transition-all flex items-center gap-3 min-w-[220px] ${
                isSelected
                  ? 'bg-royal-600 text-white border-royal-600 shadow-lg shadow-royal-900/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-royal-600 dark:text-royal-400'
                }`}
              >
                {shipment.shipmentCode.slice(-3)}
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-mono font-bold">
                  {shipment.shipmentCode}
                </div>
                <div className={`text-[10px] truncate max-w-[130px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {shipment.supplierName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Shipment Visual Stepper */}
      {selectedShipment && <InboundWorkflowStepper shipment={selectedShipment} />}

      {/* Create Inbound Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Initiate Inbound Receiving Shipment
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Shipment Code</label>
                  <input
                    type="text"
                    value={shipmentCode}
                    onChange={(e) => setShipmentCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Tata International Logistics"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="MH-04-JK-9941"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
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
                  Start Receiving Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
