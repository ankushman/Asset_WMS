import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MockInboundShipment,
  MockOutboundOrder,
  INITIAL_INBOUND,
  INITIAL_OUTBOUND,
  MockWorkflowStep,
} from '@/lib/mock-data';

interface WorkflowState {
  inboundShipments: MockInboundShipment[];
  outboundOrders: MockOutboundOrder[];
  addInboundShipment: (shipment: Omit<MockInboundShipment, 'id' | 'createdAt' | 'steps'>) => void;
  updateInboundStep: (
    shipmentId: string,
    stepId: string,
    status: MockWorkflowStep['status'],
    remarks: string,
    employeeName: string,
    progress: number
  ) => void;
  addOutboundOrder: (order: Omit<MockOutboundOrder, 'id' | 'createdAt' | 'steps'>) => void;
  updateOutboundStep: (
    orderId: string,
    stepId: string,
    status: MockWorkflowStep['status'],
    remarks: string,
    employeeName: string,
    progress: number
  ) => void;
  recordGatePassPrint: (orderId: string, printedBy: string) => void;
}

const DEFAULT_INBOUND_STEPS = [
  'Vehicle Reporting',
  'Dock Allocation',
  'Unload',
  'Staging',
  'Inspection',
  'Counting',
  'GRN Generation',
  'Put Away',
  'Completed',
];

const DEFAULT_OUTBOUND_STEPS = [
  'Invoice & Order Created',
  'Picking',
  'Packing',
  'Staging',
  'Gate Pass',
  'Handover to Transporter',
  'Completed',
];

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      inboundShipments: INITIAL_INBOUND,
      outboundOrders: INITIAL_OUTBOUND,
      addInboundShipment: (data) => {
        const id = `inb-${Date.now()}`;
        const steps: MockWorkflowStep[] = DEFAULT_INBOUND_STEPS.map((name, idx) => ({
          id: `step-${id}-${idx + 1}`,
          stepName: name,
          stepOrder: idx + 1,
          status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
          employeeName: idx === 0 ? 'Gate Operator' : 'Unassigned',
          timestamp: idx === 0 ? new Date().toLocaleString() : 'Pending',
          remarks: idx === 0 ? 'Shipment initiated at security gate.' : '',
          progress: idx === 0 ? 50 : 0,
        }));

        const newShipment: MockInboundShipment = {
          ...data,
          id,
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
          steps,
        };

        set((state) => ({ inboundShipments: [newShipment, ...state.inboundShipments] }));
      },
      updateInboundStep: (shipmentId, stepId, status, remarks, employeeName, progress) => {
        set((state) => ({
          inboundShipments: state.inboundShipments.map((s) => {
            if (s.id !== shipmentId) return s;
            const updatedSteps = s.steps.map((st) => {
              if (st.id !== stepId) return st;
              return {
                ...st,
                status,
                remarks: remarks || st.remarks,
                employeeName: employeeName || st.employeeName,
                progress: status === 'COMPLETED' ? 100 : progress,
                timestamp: new Date().toLocaleString(),
              };
            });

            // Check if all steps completed
            const allDone = updatedSteps.every((st) => st.status === 'COMPLETED');
            const overallStatus = allDone ? 'COMPLETED' : 'IN_PROGRESS';

            return {
              ...s,
              status: overallStatus,
              steps: updatedSteps,
            };
          }),
        }));
      },
      addOutboundOrder: (data) => {
        const id = `out-${Date.now()}`;
        const steps: MockWorkflowStep[] = DEFAULT_OUTBOUND_STEPS.map((name, idx) => ({
          id: `step-${id}-${idx + 1}`,
          stepName: name,
          stepOrder: idx + 1,
          status: idx === 0 ? 'COMPLETED' : idx === 1 ? 'IN_PROGRESS' : 'PENDING',
          employeeName: idx === 0 ? 'Sales Admin' : 'Unassigned',
          timestamp: new Date().toLocaleString(),
          remarks: idx === 0 ? 'Invoice created & sent to WMS queue.' : '',
          progress: idx === 0 ? 100 : idx === 1 ? 25 : 0,
        }));

        const newOrder: MockOutboundOrder = {
          ...data,
          id,
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
          steps,
        };

        set((state) => ({ outboundOrders: [newOrder, ...state.outboundOrders] }));
      },
      updateOutboundStep: (orderId, stepId, status, remarks, employeeName, progress) => {
        set((state) => ({
          outboundOrders: state.outboundOrders.map((o) => {
            if (o.id !== orderId) return o;
            let updatedSteps = o.steps.map((st) => {
              if (st.id !== stepId) return st;
              return {
                ...st,
                status,
                remarks: remarks || st.remarks,
                employeeName: employeeName || st.employeeName,
                progress: status === 'COMPLETED' ? 100 : progress,
                timestamp: new Date().toLocaleString(),
              };
            });

            // If "Handover to Transporter" was completed, automatically mark "Completed" step completed too!
            const handoverStep = updatedSteps.find((st) => st.stepName === 'Handover to Transporter');
            if (handoverStep && handoverStep.status === 'COMPLETED') {
              updatedSteps = updatedSteps.map((st) => {
                if (st.stepName === 'Completed') {
                  return {
                    ...st,
                    status: 'COMPLETED',
                    progress: 100,
                    timestamp: new Date().toLocaleString(),
                    remarks: 'Outbound order completed & handed over to transporter.',
                  };
                }
                return st;
              });
            }

            const allDone = updatedSteps.every((st) => st.status === 'COMPLETED');
            const overallStatus = allDone ? 'COMPLETED' : 'IN_PROGRESS';

            return {
              ...o,
              status: overallStatus,
              steps: updatedSteps,
            };
          }),
        }));
      },
      recordGatePassPrint: (orderId, printedBy) => {
        const printTime = new Date().toLocaleString();
        set((state) => ({
          outboundOrders: state.outboundOrders.map((o) => {
            if (o.id !== orderId) return o;
            const updatedSteps = o.steps.map((st) => {
              if (st.stepName === 'Gate Pass') {
                const printNote = `Printed on ${printTime} by ${printedBy}`;
                return {
                  ...st,
                  remarks: st.remarks ? `${st.remarks} (${printNote})` : printNote,
                };
              }
              return st;
            });

            return {
              ...o,
              gatePassPrintedAt: printTime,
              gatePassPrintedBy: printedBy,
              steps: updatedSteps,
            };
          }),
        }));
      },
    }),
    {
      name: 'sankaj-workflow-storage',
    }
  )
);
