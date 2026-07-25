import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'INVOICE' | 'PO' | 'GRN' | 'POD' | 'WARRANTY' | 'INSPECTION';
  fileUrl: string;
  fileSize: string;
  version: string;
  ocrStatus: 'VERIFIED' | 'PROCESSING' | 'PENDING';
  uploadedBy: string;
  uploadedAt: string;
}

interface DocumentState {
  documents: DocumentRecord[];
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadedAt'>) => void;
}

const INITIAL_DOCS: DocumentRecord[] = [
  { id: 'doc-1', title: 'Sales Invoice INV-SNK-9901 (Mahindra)', category: 'INVOICE', fileUrl: '#', fileSize: '1.2 MB', version: 'v1.0', ocrStatus: 'VERIFIED', uploadedBy: 'Super Admin', uploadedAt: '2026-07-24' },
  { id: 'doc-2', title: 'Proof of Delivery (POD) - TRP-8801', category: 'POD', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', fileSize: '850 KB', version: 'v1.0', ocrStatus: 'VERIFIED', uploadedBy: 'Suresh Kumar (Driver)', uploadedAt: '2026-07-24' },
  { id: 'doc-3', title: 'Toyota Forklift Extended Warranty Certificate', category: 'WARRANTY', fileUrl: '#', fileSize: '3.4 MB', version: 'v2.1', ocrStatus: 'VERIFIED', uploadedBy: 'Konecranes Support', uploadedAt: '2026-06-15' },
];

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: INITIAL_DOCS,
      addDocument: (doc) => set((state) => ({ documents: [{ ...doc, id: `doc-${Date.now()}`, uploadedAt: new Date().toISOString().split('T')[0] }, ...state.documents] })),
    }),
    { name: 'ennea-doc-storage' }
  )
);
