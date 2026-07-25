import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  role: string;
  shiftName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  overtimeHrs: number;
  directQty: number; // Direct pick/pack output
  supervisoryScore: number; // Supervisory productivity score %
  targetQty: number;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType: 'CASUAL' | 'SICK' | 'EARNED' | 'COMP_OFF';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface WorkforceState {
  shifts: Shift[];
  attendances: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  checkInUser: (userId: string, userName: string, role: string, shiftName: string) => void;
  checkOutUser: (attendanceId: string, overtimeHrs: number, directQty: number) => void;
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
}

const INITIAL_SHIFTS: Shift[] = [
  { id: 'shf-1', name: 'Morning Shift A', startTime: '06:00 AM', endTime: '02:00 PM' },
  { id: 'shf-2', name: 'Evening Shift B', startTime: '02:00 PM', endTime: '10:00 PM' },
  { id: 'shf-3', name: 'Night Shift C', startTime: '10:00 PM', endTime: '06:00 AM' },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', userId: 'usr-006', userName: 'Rohan Deshmukh', role: 'PICKER', shiftName: 'Morning Shift A', date: '2026-07-24', checkIn: '06:02 AM', checkOut: '02:30 PM', overtimeHrs: 0.5, directQty: 420, supervisoryScore: 92, targetQty: 400, status: 'PRESENT' },
  { id: 'att-2', userId: 'usr-007', userName: 'Suresh Patil', role: 'PACKER', shiftName: 'Morning Shift A', date: '2026-07-24', checkIn: '05:55 AM', checkOut: '02:00 PM', overtimeHrs: 0.0, directQty: 380, supervisoryScore: 88, targetQty: 350, status: 'PRESENT' },
  { id: 'att-3', userId: 'usr-004', userName: 'Priya Sundaram', role: 'SUPERVISOR', shiftName: 'Morning Shift A', date: '2026-07-24', checkIn: '05:50 AM', checkOut: '03:00 PM', overtimeHrs: 1.0, directQty: 0, supervisoryScore: 96, targetQty: 0, status: 'PRESENT' },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'lev-1', userId: 'usr-005', userName: 'Amitabh Verma', leaveType: 'CASUAL', startDate: '2026-07-28', endDate: '2026-07-29', reason: 'Personal family event', status: 'PENDING' },
];

export const useWorkforceStore = create<WorkforceState>()(
  persist(
    (set) => ({
      shifts: INITIAL_SHIFTS,
      attendances: INITIAL_ATTENDANCE,
      leaveRequests: INITIAL_LEAVES,
      checkInUser: (userId, userName, role, shiftName) => {
        const newAtt: AttendanceRecord = {
          id: `att-${Date.now()}`,
          userId,
          userName,
          role,
          shiftName,
          date: new Date().toISOString().split('T')[0],
          checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          overtimeHrs: 0,
          directQty: 0,
          supervisoryScore: 85,
          targetQty: 350,
          status: 'PRESENT',
        };
        set((state) => ({ attendances: [newAtt, ...state.attendances] }));
      },
      checkOutUser: (attendanceId, overtimeHrs, directQty) => {
        set((state) => ({
          attendances: state.attendances.map((a) =>
            a.id === attendanceId
              ? {
                  ...a,
                  checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  overtimeHrs,
                  directQty,
                  supervisoryScore: directQty >= a.targetQty ? 95 : 80,
                }
              : a
          ),
        }));
      },
      addLeaveRequest: (req) => set((state) => ({ leaveRequests: [{ ...req, id: `lev-${Date.now()}`, status: 'PENDING' }, ...state.leaveRequests] })),
      updateLeaveStatus: (id, status) => set((state) => ({ leaveRequests: state.leaveRequests.map((l) => (l.id === id ? { ...l, status } : l)) })),
    }),
    { name: 'ennea-workforce-storage' }
  )
);
