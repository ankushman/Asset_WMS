import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TransportVendor {
  id: string;
  name: string;
  code: string;
  phone: string;
  email: string;
  rating: number;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string; // 32ft Container, 20ft Truck, E-Tractor
  capacityTons: number;
  fuelType: string;
  documentsCheck: boolean;
  insuranceNo: string;
  fitnessExpiry: string;
  vendorId: string;
  vendorName: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  rating: number;
}

export interface DeliveryTrip {
  id: string;
  tripNumber: string;
  warehouseId: string;
  warehouseName: string;
  vendorId: string;
  vendorName: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  customerName: string;
  destination: string;
  dispatchTime: string;
  expectedArrival: string;
  actualArrival?: string;
  distanceKm: number;
  status: 'SCHEDULED' | 'GATE_OUT' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'COMPLETED';
  delayReason?: string;
  podUrl?: string;
}

interface TmsState {
  vendors: TransportVendor[];
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: DeliveryTrip[];
  addVendor: (vendor: Omit<TransportVendor, 'id'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  addTrip: (trip: Omit<DeliveryTrip, 'id'>) => void;
  updateTripStatus: (tripId: string, status: DeliveryTrip['status'], actualArrival?: string, delayReason?: string, podUrl?: string) => void;
}

const INITIAL_VENDORS: TransportVendor[] = [
  { id: 'vnd-001', name: 'VRL Logistics Ltd.', code: 'VND-VRL-01', phone: '+91 22 2847 1100', email: 'ops@vrl.in', rating: 4.8 },
  { id: 'vnd-002', name: 'TCI Freight Global', code: 'VND-TCI-02', phone: '+91 124 238 1800', email: 'dispatch@tcifreight.com', rating: 4.6 },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh-001', vehicleNumber: 'MH-04-JK-9941', type: '32ft Multi-Axle Container', capacityTons: 18, fuelType: 'Diesel', documentsCheck: true, insuranceNo: 'INS-ICICI-994102', fitnessExpiry: '2027-06-30', vendorId: 'vnd-001', vendorName: 'VRL Logistics Ltd.' },
  { id: 'veh-002', vehicleNumber: 'DL-01-AX-1102', type: '20ft Heavy Freight Truck', capacityTons: 10, fuelType: 'Diesel', documentsCheck: true, insuranceNo: 'INS-BAJAJ-881203', fitnessExpiry: '2026-11-15', vendorId: 'vnd-002', vendorName: 'TCI Freight Global' },
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 'drv-001', name: 'Suresh Kumar', licenseNumber: 'MH-04-2018-99412', phone: '+91 98200 11223', rating: 4.9 },
  { id: 'drv-002', name: 'Ramesh Yadav', licenseNumber: 'DL-01-2020-44102', phone: '+91 98111 44556', rating: 4.7 },
];

const INITIAL_TRIPS: DeliveryTrip[] = [
  {
    id: 'trp-001',
    tripNumber: 'TRP-2026-8801',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Mega Hub',
    vendorId: 'vnd-001',
    vendorName: 'VRL Logistics Ltd.',
    vehicleId: 'veh-001',
    vehicleNumber: 'MH-04-JK-9941',
    driverId: 'drv-001',
    driverName: 'Suresh Kumar',
    customerName: 'Mahindra Auto Parts Division',
    destination: 'Pune Chakan Plant',
    dispatchTime: '2026-07-24 08:30 AM',
    expectedArrival: '2026-07-24 02:00 PM',
    actualArrival: '2026-07-24 01:45 PM',
    distanceKm: 148,
    status: 'DELIVERED',
    podUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'trp-002',
    tripNumber: 'TRP-2026-8802',
    warehouseId: 'wh-002',
    warehouseName: 'Delhi North Logistics Park',
    vendorId: 'vnd-002',
    vendorName: 'TCI Freight Global',
    vehicleId: 'veh-002',
    vehicleNumber: 'DL-01-AX-1102',
    driverId: 'drv-002',
    driverName: 'Ramesh Yadav',
    customerName: 'Reliance Industrial Depot',
    destination: 'Jaipur Logistics Zone',
    dispatchTime: '2026-07-24 10:00 AM',
    expectedArrival: '2026-07-24 06:00 PM',
    distanceKm: 270,
    status: 'IN_TRANSIT',
  },
];

export const useTmsStore = create<TmsState>()(
  persist(
    (set) => ({
      vendors: INITIAL_VENDORS,
      vehicles: INITIAL_VEHICLES,
      drivers: INITIAL_DRIVERS,
      trips: INITIAL_TRIPS,
      addVendor: (vendor) => set((state) => ({ vendors: [{ ...vendor, id: `vnd-${Date.now()}` }, ...state.vendors] })),
      addVehicle: (vehicle) => set((state) => ({ vehicles: [{ ...vehicle, id: `veh-${Date.now()}` }, ...state.vehicles] })),
      addDriver: (driver) => set((state) => ({ drivers: [{ ...driver, id: `drv-${Date.now()}` }, ...state.drivers] })),
      addTrip: (trip) => set((state) => ({ trips: [{ ...trip, id: `trp-${Date.now()}` }, ...state.trips] })),
      updateTripStatus: (tripId, status, actualArrival, delayReason, podUrl) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId ? { ...t, status, actualArrival: actualArrival || t.actualArrival, delayReason: delayReason || t.delayReason, podUrl: podUrl || t.podUrl } : t
          ),
        })),
    }),
    { name: 'sankaj-tms-storage' }
  )
);
