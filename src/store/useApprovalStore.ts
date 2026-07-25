import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApprovalRequest {
  id: string;
  category: 'ASSET_PURCHASE' | 'ASSET_DISPOSAL' | 'INVENTORY_ADJUSTMENT' | 'STOCK_TRANSFER' | 'USER_CREATION' | 'LEAVE_REQUEST' | 'MAINTENANCE_REQUEST';
  title: string;
  requestorName: string;
  warehouseName: string;
  amount?: number;
  comments?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approverName?: string;
  decisionDate?: string;
}

interface ApprovalState {
  requests: ApprovalRequest[];
  addRequest: (req: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateStatus: (id: string, status: 'APPROVED' | 'REJECTED', approverName: string, comments?: string) => void;
}

const INITIAL_REQUESTS: ApprovalRequest[] = [
  { id: 'apr-1', category: 'ASSET_PURCHASE', title: 'Procure 2 Zebra TC52 Android Handheld Scanners', requestorName: 'Rajesh Sharma', warehouseName: 'Mumbai Central Mega Hub', amount: 150000, comments: 'Needed for peak Q3 inbound volume surge', status: 'PENDING', createdAt: '2026-07-24 09:15 AM' },
  { id: 'apr-2', category: 'STOCK_TRANSFER', title: 'Transfer 300 Pallet Wrap rolls to Bangalore Depot', requestorName: 'Amitabh Verma', warehouseName: 'Mumbai Central Mega Hub', amount: 45000, comments: 'Inter-warehouse stock balancing', status: 'PENDING', createdAt: '2026-07-24 10:30 AM' },
  { id: 'apr-3', category: 'MAINTENANCE_REQUEST', title: 'Caterpillar Generator 500-hour overhaul', requestorName: 'Karthik Reddy', warehouseName: 'Hyderabad Gateway Depot', amount: 85000, comments: 'Engine valve clearance & oil filter replacement', status: 'PENDING', createdAt: '2026-07-23 04:00 PM' },
];

export const useApprovalStore = create<ApprovalState>()(
  persist(
    (set) => ({
      requests: INITIAL_REQUESTS,
      addRequest: (req) =>
        set((state) => ({
          requests: [
            {
              ...req,
              id: `apr-${Date.now()}`,
              status: 'PENDING',
              createdAt: new Date().toLocaleString(),
            },
            ...state.requests,
          ],
        })),
      updateStatus: (id, status, approverName, comments) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  approverName,
                  comments: comments || r.comments,
                  decisionDate: new Date().toLocaleString(),
                }
              : r
          ),
        })),
    }),
    { name: 'ennea-approval-storage' }
  )
);
