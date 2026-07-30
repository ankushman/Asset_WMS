import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockWarehouse, MockCompany, INITIAL_WAREHOUSES, INITIAL_COMPANIES } from '@/lib/mock-data';

interface WarehouseState {
  warehouses: MockWarehouse[];
  companies: MockCompany[];
  selectedWarehouseId: string | null;
  addWarehouse: (warehouse: Omit<MockWarehouse, 'id' | 'createdAt'>) => void;
  updateWarehouse: (id: string, warehouse: Partial<MockWarehouse>) => void;
  deleteWarehouse: (id: string) => void;
  addCompany: (company: Omit<MockCompany, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, company: Partial<MockCompany>) => void;
  deleteCompany: (id: string) => void;
  setSelectedWarehouseId: (id: string | null) => void;
}

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set) => ({
      warehouses: INITIAL_WAREHOUSES,
      companies: INITIAL_COMPANIES,
      selectedWarehouseId: null,
      addWarehouse: (warehouseData) => {
        const newWh: MockWarehouse = {
          ...warehouseData,
          id: `wh-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ warehouses: [newWh, ...state.warehouses] }));
      },
      updateWarehouse: (id, data) => {
        set((state) => ({
          warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...data } : w)),
        }));
      },
      deleteWarehouse: (id) => {
        set((state) => ({
          warehouses: state.warehouses.filter((w) => w.id !== id),
        }));
      },
      addCompany: (companyData) => {
        const newComp: MockCompany = {
          ...companyData,
          id: `comp-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ companies: [newComp, ...state.companies] }));
      },
      updateCompany: (id, data) => {
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },
      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        }));
      },
      setSelectedWarehouseId: (id) => set({ selectedWarehouseId: id }),
    }),
    {
      name: 'sankaj-warehouse-storage',
    }
  )
);
