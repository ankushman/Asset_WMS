import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockInventoryItem, INITIAL_INVENTORY } from '@/lib/mock-data';

interface InventoryState {
  items: MockInventoryItem[];
  addItem: (item: Omit<MockInventoryItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, item: Partial<MockInventoryItem>) => void;
  deleteItem: (id: string) => void;
  adjustStock: (id: string, deltaAvailable: number, deltaReserved?: number, deltaDamaged?: number) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: INITIAL_INVENTORY,
      addItem: (itemData) => {
        const newItem: MockInventoryItem = {
          ...itemData,
          id: `inv-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },
      updateItem: (id, data) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== id) return i;
            const updated = { ...i, ...data };
            // Auto update status based on available stock
            if (updated.available <= 0) {
              updated.status = 'OUT_OF_STOCK';
            } else if (updated.available <= updated.minStock) {
              updated.status = 'LOW_STOCK';
            } else {
              updated.status = 'IN_STOCK';
            }
            return updated;
          }),
        }));
      },
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      adjustStock: (id, deltaAvailable, deltaReserved = 0, deltaDamaged = 0) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            const newAvail = Math.max(0, item.available + deltaAvailable);
            const newRes = Math.max(0, item.reserved + deltaReserved);
            const newDam = Math.max(0, item.damaged + deltaDamaged);
            const totalQty = newAvail + newRes + newDam;
            let status: MockInventoryItem['status'] = 'IN_STOCK';
            if (newAvail <= 0) status = 'OUT_OF_STOCK';
            else if (newAvail <= item.minStock) status = 'LOW_STOCK';

            return {
              ...item,
              quantity: totalQty,
              available: newAvail,
              reserved: newRes,
              damaged: newDam,
              status,
            };
          }),
        }));
      },
    }),
    {
      name: 'ennea-inventory-storage',
    }
  )
);
