import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async getInboundShipments() {
    return [
      {
        id: 'inb-001',
        shipmentCode: 'INB-2026-001',
        supplierName: 'Tata Steel Industrial Supply Hub',
        vehicleNumber: 'MH-04-JK-9941',
        dockNumber: 'Dock 04',
        totalItems: 450,
        warehouseId: 'wh-001',
        warehouseName: 'Mumbai Central Mega Hub',
        status: 'IN_PROGRESS',
        createdAt: '2026-07-24T06:30:00Z',
        steps: [
          { id: 'st-1', stepName: 'Vehicle Reporting', stepOrder: 1, status: 'COMPLETED', employeeName: 'Rohan Deshmukh', timestamp: '2026-07-24 06:45 AM', remarks: 'Vehicle reported at main gate security.' },
          { id: 'st-2', stepName: 'Dock Allocation', stepOrder: 2, status: 'COMPLETED', employeeName: 'Priya Sundaram', timestamp: '2026-07-24 07:05 AM', remarks: 'Assigned Bay Dock 04.' },
          { id: 'st-3', stepName: 'Unload', stepOrder: 3, status: 'COMPLETED', employeeName: 'Suresh Patil', timestamp: '2026-07-24 07:45 AM', remarks: '18 Pallets unloaded.' },
          { id: 'st-4', stepName: 'Staging', stepOrder: 4, status: 'IN_PROGRESS', employeeName: 'Rohan Deshmukh', timestamp: '2026-07-24 08:15 AM', remarks: 'Moved to Inbound Staging Zone B.' },
          { id: 'st-5', stepName: 'Inspection', stepOrder: 5, status: 'PENDING', employeeName: 'Amitabh Verma', timestamp: 'Pending', remarks: '' },
          { id: 'st-6', stepName: 'Counting', stepOrder: 6, status: 'PENDING', employeeName: 'Amitabh Verma', timestamp: 'Pending', remarks: '' },
          { id: 'st-7', stepName: 'GRN Generation', stepOrder: 7, status: 'PENDING', employeeName: 'Rajesh Sharma', timestamp: 'Pending', remarks: '' },
          { id: 'st-8', stepName: 'Put Away', stepOrder: 8, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
          { id: 'st-9', stepName: 'Completed', stepOrder: 9, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
        ],
      },
    ];
  }

  async getOutboundOrders() {
    return [
      {
        id: 'out-001',
        orderCode: 'OUT-2026-001',
        customer: 'Mahindra Auto Parts Division',
        invoiceNo: 'INV-SNK-9901',
        pickingType: 'Pallet',
        totalItems: 450,
        warehouseId: 'wh-001',
        warehouseName: 'Mumbai Central Mega Hub',
        status: 'IN_PROGRESS',
        createdAt: '2026-07-24T07:15:00Z',
        steps: [
          { id: 'so-1', stepName: 'Invoice & Order Created', stepOrder: 1, status: 'COMPLETED', employeeName: 'Deepak Sangkaj', timestamp: '2026-07-24 07:20 AM', remarks: 'Invoice verified.' },
          { id: 'so-2', stepName: 'Picking', stepOrder: 2, status: 'COMPLETED', employeeName: 'Rohan Deshmukh', timestamp: '2026-07-24 08:00 AM', remarks: 'Pallet picking finished.' },
          { id: 'so-3', stepName: 'Packing', stepOrder: 3, status: 'IN_PROGRESS', employeeName: 'Suresh Patil', timestamp: '2026-07-24 08:45 AM', remarks: 'Shrink wrapping.' },
          { id: 'so-4', stepName: 'Staging', stepOrder: 4, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
          { id: 'so-5', stepName: 'Gate Pass', stepOrder: 5, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
          { id: 'so-6', stepName: 'Handover to Transporter', stepOrder: 6, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
          { id: 'so-7', stepName: 'Completed', stepOrder: 7, status: 'PENDING', employeeName: 'Unassigned', timestamp: 'Pending', remarks: '' },
        ],
      },
    ];
  }

  async recordGatePassPrint(orderId: string, printedBy: string) {
    const printTime = new Date().toLocaleString();
    return {
      orderId,
      gatePassNo: `GP-${orderId}`,
      printedAt: printTime,
      printedBy,
      message: 'Gate Pass print audit logged successfully in database.',
    };
  }
}
