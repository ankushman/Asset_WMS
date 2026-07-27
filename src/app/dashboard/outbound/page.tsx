'use client';

import React, { useState } from 'react';
import { Send, Plus, Search } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { OutboundWorkflowStepper } from '@/components/workflows/OutboundWorkflowStepper';

export default function OutboundPage() {
  const { outboundOrders, addOutboundOrder } = useWorkflowStore();
  const { warehouses } = useWarehouseStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(outboundOrders[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [orderCode, setOrderCode] = useState(`OUT-2026-00${outboundOrders.length + 1}`);
  const [customer, setCustomer] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(`INV-SNK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [pickingType, setPickingType] = useState<'Case' | 'Batch' | 'Loose' | 'Pallet' | 'Box'>('Pallet');
  const [totalItems, setTotalItems] = useState(300);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-001');

  const selectedOrder = outboundOrders.find((o) => o.id === selectedOrderId) || outboundOrders[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === warehouseId);
    addOutboundOrder({
      orderCode,
      customer,
      invoiceNo,
      pickingType,
      totalItems: Number(totalItems),
      warehouseId,
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
            <Send className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Outbound Dispatch & 7-Step Picking Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Invoice -&gt; Picking -&gt; Packing -&gt; Staging -&gt; Gate Pass -&gt; Handover to Transporter -&gt; Completed.
          </p>
        </div>

        <button
          onClick={() => {
            setOrderCode(`OUT-2026-00${outboundOrders.length + 1}`);
            setCustomer('');
            setInvoiceNo(`INV-SNK-${Math.floor(1000 + Math.random() * 9000)}`);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Outbound Order
        </button>
      </div>

      {/* Orders Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {outboundOrders.map((order) => {
          const isSelected = order.id === selectedOrderId;
          return (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`p-3.5 rounded-2xl border text-xs font-semibold whitespace-nowrap text-left transition-all flex items-center gap-3 min-w-[220px] ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-900/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {order.orderCode.slice(-3)}
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-mono font-bold">
                  {order.orderCode}
                </div>
                <div className={`text-[10px] truncate max-w-[130px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {order.customer}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stepper Display */}
      {selectedOrder && <OutboundWorkflowStepper order={selectedOrder} />}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Outbound Dispatch Order
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Order Code</label>
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer / Client</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Mahindra Auto Parts Division"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Picking Type Strategy</label>
                  <select
                    value={pickingType}
                    onChange={(e) => setPickingType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Case">Case</option>
                    <option value="Batch">Batch</option>
                    <option value="Loose">Loose</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Box">Box</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    value={totalItems}
                    onChange={(e) => setTotalItems(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Warehouse</label>
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
                  Create Order & Begin Picking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
