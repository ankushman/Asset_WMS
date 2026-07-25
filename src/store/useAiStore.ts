import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AiRecommendation {
  id: string;
  category: 'INVENTORY' | 'MANPOWER' | 'MAINTENANCE' | 'TRANSPORTATION' | 'STORAGE';
  title: string;
  reason: string;
  expectedImpact: string;
  confidenceScore: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  costSavings?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  structuredData?: any;
}

interface AiState {
  healthScore: number;
  recommendations: AiRecommendation[];
  chatHistory: ChatMessage[];
  addMessage: (text: string, sender: 'USER' | 'AI', data?: any) => void;
  clearChat: () => void;
}

const INITIAL_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-1',
    category: 'INVENTORY',
    title: 'Transfer 300 Pallet Units of Hydraulic Fluid to Delhi Hub',
    reason: 'Delhi Logistics Park has an impending stockout risk of 88% due to peak Q3 manufacturing demand in North Zone.',
    expectedImpact: 'Prevents 4-day line stoppage for Mahindra Auto Parts.',
    confidenceScore: 96,
    priority: 'CRITICAL',
    costSavings: 185000,
  },
  {
    id: 'rec-2',
    category: 'MAINTENANCE',
    title: 'Schedule Caterpillar Generator Overhaul for Hyderabad Hub',
    reason: 'Vibration sensors detect early mechanical bearing degradation (Remaining Useful Life: 48 hours).',
    expectedImpact: 'Avoids unannounced power grid downtime during peak dispatch.',
    confidenceScore: 94,
    priority: 'HIGH',
    costSavings: 92000,
  },
  {
    id: 'rec-3',
    category: 'TRANSPORTATION',
    title: 'Switch Express Route for Fleet Trip TRP-8802 via NH-48',
    reason: 'Heavy monsoon traffic delay predicted on State Highway 17 (+2.5 hours delay expected).',
    expectedImpact: 'Ensures 100% SLA compliance for Reliance Industrial Depot.',
    confidenceScore: 91,
    priority: 'MEDIUM',
    costSavings: 45000,
  },
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'AI',
    text: 'Hello! I am Ennea AI Command Assistant. Ask me anything about warehouse occupancy, delayed shipments, equipment maintenance, low stock, or executive reports.',
    timestamp: 'Just now',
  },
];

export const useAiStore = create<AiState>()(
  persist(
    (set) => ({
      healthScore: 96,
      recommendations: INITIAL_RECOMMENDATIONS,
      chatHistory: INITIAL_CHAT,
      addMessage: (text, sender, structuredData) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              id: `msg-${Date.now()}`,
              sender,
              text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              structuredData,
            },
          ],
        })),
      clearChat: () => set({ chatHistory: INITIAL_CHAT }),
    }),
    { name: 'ennea-ai-storage' }
  )
);
