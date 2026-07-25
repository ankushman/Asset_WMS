'use client';

import React, { useState } from 'react';
import { Compass, Plus, Search, Truck, User, MapPin, Clock, FileCheck, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTmsStore, DeliveryTrip } from '@/store/useTmsStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';

export default function TransportationPage() {
  const { vendors, vehicles, drivers, trips, addTrip, updateTripStatus } = useTmsStore();
  const { warehouses } = useWarehouseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTripForPod, setSelectedTripForPod] = useState<DeliveryTrip | null>(null);

  // Form State
  const [tripNumber, setTripNumber] = useState(`TRP-2026-880${trips.length + 1}`);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-001');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || 'vnd-001');
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || 'veh-001');
  const [driverId, setDriverId] = useState(drivers[0]?.id || 'drv-001');
  const [customerName, setCustomerName] = useState('');
  const [destination, setDestination] = useState('');
  const [expectedArrival, setExpectedArrival] = useState('2026-07-24 06:00 PM');
  const [distanceKm, setDistanceKm] = useState(150);

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStat = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesStat;
  });

  const onTimeCount = trips.filter((t) => t.status === 'DELIVERED' || t.status === 'COMPLETED').length;
  const onTimeRate = trips.length ? Math.round((onTimeCount / trips.length) * 100) : 100;

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === warehouseId);
    const vnd = vendors.find((v) => v.id === vendorId);
    const veh = vehicles.find((v) => v.id === vehicleId);
    const drv = drivers.find((d) => d.id === driverId);

    addTrip({
      tripNumber,
      warehouseId,
      warehouseName: wh?.name || 'Mumbai Central Hub',
      vendorId,
      vendorName: vnd?.name || 'VRL Logistics',
      vehicleId,
      vehicleNumber: veh?.vehicleNumber || 'MH-04-JK-9941',
      driverId,
      driverName: drv?.name || 'Suresh Kumar',
      customerName,
      destination,
      dispatchTime: new Date().toLocaleString(),
      expectedArrival,
      distanceKm: Number(distanceKm),
      status: 'GATE_OUT',
    });
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (tripId: string, status: DeliveryTrip['status']) => {
    const arrivalTime = status === 'DELIVERED' || status === 'COMPLETED' ? new Date().toLocaleString() : undefined;
    updateTripStatus(tripId, status, arrivalTime);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            Transportation Management System (TMS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch delivery trips, track transport vendors, vehicle documents, gate in/out, and proof of delivery (POD).
          </p>
        </div>

        <button
          onClick={() => {
            setTripNumber(`TRP-2026-880${trips.length + 1}`);
            setCustomerName('');
            setDestination('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-royal-600 hover:bg-royal-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Dispatch Delivery Trip
        </button>
      </div>

      {/* TMS Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Delivery Trips</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{trips.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">On-Time Delivery Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{onTimeRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Registered Vendors</span>
          <p className="text-2xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">{vendors.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Verified Fleet Vehicles</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{vehicles.length}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trip number, customer, or vehicle..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          <option value="GATE_OUT">GATE_OUT</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="DELAYED">DELAYED</option>
        </select>
      </div>

      {/* Delivery Trips Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Trip Code & Customer</th>
                <th className="p-4">Transporter & Driver</th>
                <th className="p-4">Vehicle & Distance</th>
                <th className="p-4">Dispatch / Expected Arrival</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions / POD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {trip.customerName}
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-royal-50 text-royal-700 dark:bg-royal-950 dark:text-royal-300">
                        {trip.tripNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-royal-500" /> {trip.destination}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{trip.vendorName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3" /> Driver: {trip.driverName}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{trip.vehicleNumber}</div>
                    <div className="text-[11px] text-slate-400">{trip.distanceKm} km trip</div>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    <div>Dispatch: {trip.dispatchTime}</div>
                    <div className="text-royal-600 dark:text-royal-400">ETA: {trip.expectedArrival}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        trip.status === 'DELIVERED' || trip.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : trip.status === 'IN_TRANSIT'
                          ? 'bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300'
                          : trip.status === 'DELAYED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {trip.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleUpdateStatus(trip.id, 'DELIVERED')}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {trip.podUrl ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> POD Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedTripForPod(trip)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-royal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          title="Upload Proof of Delivery (POD)"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POD Upload Modal */}
      {selectedTripForPod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              Upload Proof of Delivery (POD) - {selectedTripForPod.tripNumber}
            </h3>

            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-royal-500 transition-colors">
              <Upload className="w-8 h-8 text-royal-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to attach scanned POD signature document or photo
              </p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTripForPod(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTripStatus(selectedTripForPod.id, 'DELIVERED', new Date().toLocaleString(), undefined, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
                  setSelectedTripForPod(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md"
              >
                Save Verified POD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Dispatch New Delivery Trip
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Trip Number</label>
                  <input
                    type="text"
                    value={tripNumber}
                    onChange={(e) => setTripNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Mahindra Auto Parts"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Address</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Pune Chakan Plant"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transport Vendor</label>
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.type})
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
                  className="px-4 py-2 font-semibold text-white bg-royal-600 rounded-xl hover:bg-royal-700 shadow-md"
                >
                  Confirm Gate Out & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
