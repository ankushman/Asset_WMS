'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, Edit3, User, MessageSquare, Send, PackageCheck, Truck, Printer, FileText } from 'lucide-react';
import { MockOutboundOrder, MockWorkflowStep } from '@/lib/mock-data';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useAuthStore } from '@/store/useAuthStore';
import { printGatePassPDF } from '@/lib/export-utils';

interface OutboundWorkflowStepperProps {
  order: MockOutboundOrder;
}

export function OutboundWorkflowStepper({ order }: OutboundWorkflowStepperProps) {
  const { updateOutboundStep, recordGatePassPrint } = useWorkflowStore();
  const { user, hasPermission } = useAuthStore();
  const [editingStep, setEditingStep] = useState<MockWorkflowStep | null>(null);

  const [statusInput, setStatusInput] = useState<MockWorkflowStep['status']>('IN_PROGRESS');
  const [employeeInput, setEmployeeInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [progressInput, setProgressInput] = useState(100);

  // Transporter Handover & Gate Pass custom fields
  const [transporterName, setTransporterName] = useState('VRL Logistics Ltd');
  const [driverName, setDriverName] = useState('Ramesh Kumar');
  const [driverPhone, setDriverPhone] = useState('+91 98765 12345');
  const [vehicleNo, setVehicleNo] = useState('MH-04-AB-1234');
  const [transportCompany, setTransportCompany] = useState('VRL Express Cargo');
  const [receiverSignature, setReceiverSignature] = useState('Verified Digital Sign');
  const [dispatchDateTime, setDispatchDateTime] = useState(new Date().toLocaleString());

  const isGatePassStep = editingStep?.stepName === 'Gate Pass';
  const isPrintEnabled = Boolean(
    vehicleNo.trim() &&
      driverName.trim() &&
      transporterName.trim() &&
      dispatchDateTime.trim() &&
      order.invoiceNo &&
      order.orderCode
  );

  const handleOpenEdit = (step: MockWorkflowStep) => {
    setEditingStep(step);
    setStatusInput(step.status);
    setEmployeeInput(step.employeeName === 'Unassigned' ? 'Rohan Deshmukh' : step.employeeName);
    setRemarksInput(step.remarks || '');
    setProgressInput(step.status === 'COMPLETED' ? 100 : step.progress || 100);
    if (step.stepName === 'Gate Pass' && step.timestamp !== 'Pending') {
      setDispatchDateTime(step.timestamp);
    }
  };

  const handlePrintGatePass = () => {
    if (!isPrintEnabled || !editingStep) return;

    const printedBy = user?.name || employeeInput || 'Operations Supervisor';
    recordGatePassPrint(order.id, printedBy);

    printGatePassPDF({
      gatePassNo: `GP-${order.orderCode}`,
      orderCode: order.orderCode,
      invoiceNo: order.invoiceNo,
      customerName: order.customer,
      warehouseName: order.warehouseName,
      vehicleNumber: vehicleNo,
      driverName: driverName,
      driverPhone: driverPhone,
      transporterName: transporterName,
      transportCompany: transportCompany || transporterName,
      dispatchDateTime: dispatchDateTime,
      preparedBy: employeeInput || printedBy,
      remarks: remarksInput,
      totalItems: order.totalItems,
      pickingType: order.pickingType,
      printedBy: printedBy,
      printedAt: new Date().toLocaleString(),
    });
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    let finalRemarks = remarksInput;
    if (editingStep.stepName === 'Handover to Transporter') {
      finalRemarks = `Transporter: ${transporterName} (${transportCompany}) | Driver: ${driverName} (${driverPhone}) | Vehicle: ${vehicleNo} | Handover By: ${employeeInput}${
        receiverSignature ? ` | Signature: ${receiverSignature}` : ''
      }${remarksInput ? ` | Remarks: ${remarksInput}` : ''}`;
    } else if (editingStep.stepName === 'Gate Pass') {
      finalRemarks = `Gate Pass Ref: GP-${order.orderCode} | Vehicle: ${vehicleNo} | Driver: ${driverName} (${driverPhone}) | Transporter: ${transporterName}${
        remarksInput ? ` | ${remarksInput}` : ''
      }`;
    }

    updateOutboundStep(
      order.id,
      editingStep.id,
      statusInput,
      finalRemarks,
      employeeInput,
      statusInput === 'COMPLETED' ? 100 : Number(progressInput)
    );

    setEditingStep(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Order Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Outbound Order: <span className="font-mono text-indigo-600 dark:text-indigo-400">{order.orderCode}</span>
            </h3>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                order.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customer: <strong className="text-slate-800 dark:text-slate-200">{order.customer}</strong> | Invoice: <span className="font-mono">{order.invoiceNo}</span> | Picking Type: <span className="px-2 py-0.5 font-bold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[11px]">{order.pickingType}</span> | Volume: <strong className="text-slate-800 dark:text-slate-200">{order.totalItems} units</strong>
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Source Warehouse: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.warehouseName}</span>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="mt-8 overflow-x-auto pb-4">
        <div className="min-w-[800px] flex items-center justify-between relative">
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 z-0" />

          {(() => {
            const activeStepIndex = order.steps.findIndex((s) => s.status !== 'COMPLETED');

            return order.steps.map((step, idx) => {
              const isCompleted = step.status === 'COMPLETED';
              const isActive = activeStepIndex !== -1 && idx === activeStepIndex;
              const isEditable = isCompleted || isActive;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group max-w-[110px] text-center">
                  <button
                    onClick={() => isEditable && handleOpenEdit(step)}
                    disabled={!isEditable}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 border-2 border-emerald-500 cursor-pointer'
                        : isActive
                        ? 'animate-orange-pulse bg-amber-500 text-white border-2 border-amber-400 ring-4 ring-amber-400/50 shadow-lg shadow-amber-500/50 cursor-pointer'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75'
                    }`}
                    title={isEditable ? "Click to edit step details" : "Step locked until previous step is completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isActive ? (
                      <PlayCircle className="w-5 h-5" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </button>

                  <div className="mt-3">
                    <p
                      className={`text-xs font-bold ${
                        isCompleted
                          ? 'text-slate-900 dark:text-slate-100'
                          : isActive
                          ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.stepName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[100px]" title={step.employeeName}>
                      {step.employeeName}
                    </p>
                    {step.timestamp !== 'Pending' && (
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {step.timestamp.split(' ')[1] || step.timestamp}
                      </p>
                    )}
                  </div>

                  {/* Edit Button trigger on hover only for active and completed steps */}
                  {isEditable && (
                    <button
                      onClick={() => handleOpenEdit(step)}
                      className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 hover:underline"
                    >
                      <Edit3 className="w-2.5 h-2.5" /> Edit
                    </button>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Step Audit Cards Grid */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Outbound Workflow Operations Progress
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {(() => {
            const activeStepIndex = order.steps.findIndex((s) => s.status !== 'COMPLETED');

            return order.steps.map((st, idx) => {
              const isCompleted = st.status === 'COMPLETED';
              const isActive = activeStepIndex !== -1 && idx === activeStepIndex;
              const isEditable = isCompleted || isActive;

              return (
                <div
                  key={st.id}
                  onClick={() => isEditable && handleOpenEdit(st)}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isEditable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-80'
                  } ${
                    isCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : isActive
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/50 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-400">#{st.stepOrder}</span> {st.stepName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isCompleted
                          ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                          : isActive
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-extrabold'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isActive ? 'ACTIVE STEP' : st.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> Operator: <strong className="text-slate-800 dark:text-slate-200">{st.employeeName}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Timestamp: <span className="font-mono">{st.timestamp}</span>
                    </div>
                    {st.remarks && (
                      <div className="flex items-start gap-1 text-slate-500 dark:text-slate-400 mt-1 italic">
                        <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" /> "{st.remarks}"
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{isCompleted ? 100 : st.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isActive
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${isCompleted ? 100 : st.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Modal */}
      {editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {editingStep.stepName === 'Handover to Transporter' ? (
                <Truck className="w-5 h-5 text-amber-500" />
              ) : isGatePassStep ? (
                <FileText className="w-5 h-5 text-emerald-600" />
              ) : (
                <PackageCheck className="w-5 h-5 text-indigo-600" />
              )}
              {editingStep.stepName === 'Handover to Transporter'
                ? 'Handover to Transporter Details'
                : isGatePassStep
                ? 'Security Gate Pass Clearance & Print'
                : `Edit Step: ${editingStep.stepName}`}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {editingStep.stepName === 'Handover to Transporter'
                ? 'Capture transporter dispatch, driver, vehicle details and handover confirmation.'
                : isGatePassStep
                ? 'Verify mandatory Gate Pass clearance details and generate official A4 print document.'
                : 'Update status, operator details, and dispatch progress.'}
            </p>

            <form onSubmit={handleSaveStep} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Step Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED (Finish Step)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                </select>
              </div>

              {isGatePassStep && (
                <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/40 pb-2">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Mandatory Gate Pass Fields
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                      GP-{order.orderCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Number *</label>
                      <input
                        type="text"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        placeholder="e.g. MH-04-JK-9941"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transporter / Company *</label>
                      <input
                        type="text"
                        value={transporterName}
                        onChange={(e) => setTransporterName(e.target.value)}
                        placeholder="e.g. VRL Logistics Ltd"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Driver Name *</label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Driver Phone *</label>
                      <input
                        type="text"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="e.g. +91 98765 12345"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Dispatch Date & Time *</label>
                      <input
                        type="text"
                        value={dispatchDateTime}
                        onChange={(e) => setDispatchDateTime(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice Number</label>
                      <input
                        type="text"
                        value={order.invoiceNo}
                        disabled
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingStep.stepName === 'Handover to Transporter' && (
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Transporter & Vehicle Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transporter Name</label>
                      <input
                        type="text"
                        value={transporterName}
                        onChange={(e) => setTransporterName(e.target.value)}
                        placeholder="e.g. VRL Logistics"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transport Company</label>
                      <input
                        type="text"
                        value={transportCompany}
                        onChange={(e) => setTransportCompany(e.target.value)}
                        placeholder="e.g. VRL Express Cargo"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Driver Name</label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Driver Mobile Number</label>
                      <input
                        type="text"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="e.g. +91 98765 12345"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Number</label>
                      <input
                        type="text"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        placeholder="e.g. MH-04-AB-1234"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Receiver Signature (Optional)</label>
                      <input
                        type="text"
                        value={receiverSignature}
                        onChange={(e) => setReceiverSignature(e.target.value)}
                        placeholder="Digital Sign / Verified"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Handover By / Prepared By Operator</label>
                <input
                  type="text"
                  value={employeeInput}
                  onChange={(e) => setEmployeeInput(e.target.value)}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Step Remarks / Dispatch Notes</label>
                <textarea
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  rows={2}
                  placeholder="e.g. All 450 units handed over with seal verified."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> {isGatePassStep ? 'Save Gate Pass' : 'Save Step'}
                </button>

                {isGatePassStep && hasPermission('gatepass.print') && (
                  <button
                    type="button"
                    disabled={!isPrintEnabled}
                    onClick={handlePrintGatePass}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all ${
                      isPrintEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      isPrintEnabled
                        ? 'Generate and print official A4 Gate Pass'
                        : 'Complete mandatory fields (Vehicle Number, Driver Name, Transporter) to enable printing'
                    }
                  >
                    <Printer className="w-4 h-4" /> Print Gate Pass
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

