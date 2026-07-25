import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
  id: string;
  title: string;
  eventType: 'Maintenance' | 'Shift' | 'Holiday' | 'Dispatch' | 'Inbound';
  date: string;
  time: string;
  description: string;
  facility: string;
}

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'evt-1', title: 'Toyota Forklift 500h Service', eventType: 'Maintenance', date: '2026-07-28', time: '10:00 AM', description: 'Preventive hydraulic oil replace', facility: 'Mumbai Hub' },
  { id: 'evt-2', title: 'Q3 Physical Inventory Stock Audit', eventType: 'Inbound', date: '2026-07-30', time: '06:00 AM', description: 'Full facility wall-to-wall count', facility: 'Delhi Logistics Park' },
  { id: 'evt-3', title: 'Independence Day National Holiday', eventType: 'Holiday', date: '2026-08-15', time: 'All Day', description: 'Operations closed', facility: 'All Facilities' },
  { id: 'evt-4', title: 'Bulk Shipment Dispatch to Mahindra', eventType: 'Dispatch', date: '2026-07-25', time: '02:00 PM', description: '18 Pallets freight loading', facility: 'Mumbai Hub' },
];

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: INITIAL_EVENTS,
      addEvent: (evt) => set((state) => ({ events: [{ ...evt, id: `evt-${Date.now()}` }, ...state.events] })),
    }),
    { name: 'ennea-calendar-storage' }
  )
);
