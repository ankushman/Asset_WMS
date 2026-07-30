'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Warehouse, Plus, Search, Edit2, Trash2, MapPin, Clock, User, DollarSign, Activity, Percent, ChevronRight } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { MockWarehouse } from '@/lib/mock-data';

export default function WarehousesPage() {
  const router = useRouter();
  const { warehouses, companies, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');
  const [pinCode, setPinCode] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'comp-001');
  const [managerName, setManagerName] = useState('');
  const [capacity, setCapacity] = useState(50000);
  const [occupancy, setOccupancy] = useState(75);
  const [area, setArea] = useState(85000);
  const [workingHours, setWorkingHours] = useState('24/7 Operations');
  const [rentalCost, setRentalCost] = useState(350000);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE'>('ACTIVE');

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode(`WH-LOC-0${warehouses.length + 1}`);
    setName('');
    setAddress('');
    setCity('');
    setStateName('');
    setPinCode('');
    setManagerName('Rajesh Sharma');
    setCapacity(50000);
    setOccupancy(70);
    setArea(75000);
    setWorkingHours('08:00 AM - 08:00 PM');
    setRentalCost(250000);
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: MockWarehouse) => {
    setEditingId(w.id);
    setCode(w.code);
    setName(w.name);
    setAddress(w.address);
    setCity(w.city);
    setStateName(w.state);
    setPinCode(w.pinCode);
    setCompanyId(w.companyId);
    setManagerName(w.managerName || 'Rajesh Sharma');
    setCapacity(w.capacity);
    setOccupancy(w.occupancy);
    setArea(w.area);
    setWorkingHours(w.workingHours);
    setRentalCost(w.rentalCost);
    setStatus(w.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies.find((c) => c.id === companyId);
    if (editingId) {
      updateWarehouse(editingId, {
        code,
        name,
        address,
        city,
        state: stateName,
        country,
        pinCode,
        companyId,
        companyName: company?.name,
        managerName,
        capacity: Number(capacity),
        occupancy: Number(occupancy),
        area: Number(area),
        workingHours,
        rentalCost: Number(rentalCost),
        status,
      });
    } else {
      addWarehouse({
        code,
        name,
        address,
        city,
        state: stateName,
        country,
        pinCode,
        companyId,
        companyName: company?.name || 'Sankaj Logistics Limited',
        managerName,
        capacity: Number(capacity),
        occupancy: Number(occupancy),
        area: Number(area),
        workingHours,
        rentalCost: Number(rentalCost),
        status,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Warehouse Network & Capacity Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-warehouse infrastructure, capacity allocation, manager assignments, and rental costs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Warehouse Hub
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search warehouse code, name, or city..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWarehouses.map((w) => (
          <div
            key={w.id}
            onClick={() => router.push(`/dashboard/warehouses/${w.id}`)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all space-y-4 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {w.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    {w.name}
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {w.address}, {w.city}, {w.state} ({w.pinCode})
                </p>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                  w.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {w.status.replace('_', ' ')}
              </span>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Facility Occupancy ({w.occupancy}%)</span>
                <span>{((w.capacity * w.occupancy) / 100).toLocaleString()} / {w.capacity.toLocaleString()} Units</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    w.occupancy > 85 ? 'bg-rose-500' : w.occupancy > 60 ? 'bg-emerald-500' : 'bg-royal-500'
                  }`}
                  style={{ width: `${w.occupancy}%` }}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Warehouse Manager</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {w.managerName || 'Rajesh Sharma'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Working Hours</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {w.workingHours}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Storage Area</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {w.area.toLocaleString()} Sq. Ft.
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Monthly Rental Cost</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹{w.rentalCost.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Company: {w.companyName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(w);
                  }}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Warehouse"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWarehouse(w.id);
                  }}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                  title="Delete Warehouse"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Warehouse Hub' : 'Add New Warehouse Hub'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Warehouse Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="WH-MUM-01"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Warehouse Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mumbai Central Mega Hub"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Bhiwandi Logistics Zone, Bldg 4"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="421302"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Manager</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Rajesh Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Company</label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Capacity (Units)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Occupancy %</label>
                  <input
                    type="number"
                    value={occupancy}
                    onChange={(e) => setOccupancy(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rental Cost (₹)</label>
                  <input
                    type="number"
                    value={rentalCost}
                    onChange={(e) => setRentalCost(Number(e.target.value))}
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
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
