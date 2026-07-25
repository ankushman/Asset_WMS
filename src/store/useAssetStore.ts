import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockAsset, INITIAL_ASSETS } from '@/lib/mock-data';

interface AssetHistoryItem {
  id: string;
  assetId: string;
  actionType: 'ASSIGNMENT' | 'MAINTENANCE' | 'MOVEMENT' | 'CONDITION_CHANGE';
  description: string;
  performedBy: string;
  createdAt: string;
}

interface AssetState {
  assets: MockAsset[];
  histories: AssetHistoryItem[];
  addAsset: (asset: Omit<MockAsset, 'id' | 'createdAt'>) => void;
  updateAsset: (id: string, asset: Partial<MockAsset>, actionReason?: string) => void;
  deleteAsset: (id: string) => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set) => ({
      assets: INITIAL_ASSETS,
      histories: [
        {
          id: 'hist-001',
          assetId: 'ast-001',
          actionType: 'ASSIGNMENT',
          description: 'Assigned Toyota Forklift to Priya Sundaram (Supervisor)',
          performedBy: 'Rajesh Sharma',
          createdAt: '2026-07-24T06:00:00Z',
        },
        {
          id: 'hist-002',
          assetId: 'ast-005',
          actionType: 'MAINTENANCE',
          description: 'Scheduled Caterpillar generator 500-hour oil change & valve clearance check',
          performedBy: 'Karthik Reddy',
          createdAt: '2026-07-22T14:30:00Z',
        },
      ],
      addAsset: (assetData) => {
        const newAsset: MockAsset = {
          ...assetData,
          id: `ast-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const newHist: AssetHistoryItem = {
          id: `hist-${Date.now()}`,
          assetId: newAsset.id,
          actionType: 'MOVEMENT',
          description: `Created new asset "${newAsset.name}" in ${newAsset.warehouseName}`,
          performedBy: 'System Admin',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          assets: [newAsset, ...state.assets],
          histories: [newHist, ...state.histories],
        }));
      },
      updateAsset: (id, data, actionReason) => {
        set((state) => {
          const updatedAssets = state.assets.map((a) => (a.id === id ? { ...a, ...data } : a));
          const targetAsset = updatedAssets.find((a) => a.id === id);
          const newHist: AssetHistoryItem = {
            id: `hist-${Date.now()}`,
            assetId: id,
            actionType: data.condition ? 'CONDITION_CHANGE' : 'MOVEMENT',
            description: actionReason || `Updated asset details for ${targetAsset?.name || id}`,
            performedBy: 'System User',
            createdAt: new Date().toISOString(),
          };
          return { assets: updatedAssets, histories: [newHist, ...state.histories] };
        });
      },
      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        }));
      },
    }),
    {
      name: 'ennea-asset-storage',
    }
  )
);
