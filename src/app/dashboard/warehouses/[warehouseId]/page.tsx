'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Warehouse as WarehouseIcon,
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Building2,
  Calendar,
  Layers,
  Box,
  Truck,
  ShieldCheck,
  FileText,
  Activity,
  BarChart3,
  Users,
  HardHat,
  Plus,
  Upload,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode,
  Wrench,
  Gauge,
  Sliders,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckSquare,
  Droplets,
  Trash,
  ClipboardCheck,
} from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { useWarehouseProfileStore, WarehouseDocument, WarehouseEmployee } from '@/store/useWarehouseProfileStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useMheStore } from '@/store/useMheStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useHousekeepingStore, CleaningTask, AreaCleaningStatus, HousekeepingInspection } from '@/store/useHousekeepingStore';
import { exportToPDF, exportToCSV } from '@/lib/export-utils';

type TabKey =
  | 'overview'
  | 'manpower'
  | 'housekeeping'
  | 'inventory'
  | 'assets'
  | 'equipment'
  | 'inbound'
  | 'outbound'
  | 'documents'
  | 'reports'
  | 'activity';

export default function WarehouseDetailPage({ params }: { params: Promise<{ warehouseId: string }> }) {
  const resolvedParams = use(params);
  const warehouseId = resolvedParams.warehouseId;
  const router = useRouter();

  const { warehouses } = useWarehouseStore();
  const { employees = [], documents = [], activityLogs = [], addEmployee, deleteEmployee, addDocument, deleteDocument, replaceDocument, addActivityLog } =
    useWarehouseProfileStore();
  const { items: inventoryItems = [] } = useInventoryStore();
  const { assets = [] } = useAssetStore();
  const { equipments = [] } = useMheStore();
  const { inboundShipments = [], outboundOrders = [] } = useWorkflowStore();
  const { user } = useAuthStore();

  const { staff = [], areaStatuses = [], tasks = [], toiletLogs = [], garbageRecords = [], inspections = [], updateTaskStatus, updateAreaStatus, addInspection, addGarbageRecord, addStaff } =
    useHousekeepingStore();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Document Upload Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docCategory, setDocCategory] = useState<WarehouseDocument['category']>('Warehouse Registration');
  const [docFileName, setDocFileName] = useState('');
  const [docVersion, setDocVersion] = useState('v1.0');

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<WarehouseDocument | null>(null);

  // Add Employee Modal state
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empType, setEmpType] = useState<'WHITE_COLLAR' | 'BLUE_COLLAR'>('WHITE_COLLAR');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empDepartment, setEmpDepartment] = useState('Operations');
  const [empShift, setEmpShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [empPhone, setEmpPhone] = useState('+91 98000 12345');
  const [empEmail, setEmpEmail] = useState('');
  const [empExperience, setEmpExperience] = useState('3 Years');

  // New Inspection Modal state
  const [isInspModalOpen, setIsInspModalOpen] = useState(false);
  const [inspCleanliness, setInspCleanliness] = useState(95);
  const [inspSafety, setInspSafety] = useState(98);
  const [inspHygiene, setInspHygiene] = useState(94);
  const [inspRemarks, setInspRemarks] = useState('');
  const [inspCorrective, setInspCorrective] = useState('');

  // Filter states
  const [docFilterCategory, setDocFilterCategory] = useState<string>('ALL');

  const targetWarehouse = warehouses.find((w) => w.id === warehouseId) || warehouses[0] || {
    id: warehouseId,
    code: 'WH-MUM-01',
    name: 'Mumbai Central Mega Hub',
    address: 'Bhiwandi Logistics Zone, Bldg 4',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '421302',
    capacity: 75000,
    occupancy: 82,
    area: 120000,
    workingHours: '24/7 Operations',
    rentalCost: 450000,
    status: 'ACTIVE',
    companyName: 'Sankaj Logistics Limited',
    managerName: 'Rajesh Sharma',
  };

  const isSuperOrAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'COMPANY_ADMIN' || user?.role === 'WAREHOUSE_MANAGER';
  const isSupervisor = isSuperOrAdmin || user?.role === 'SUPERVISOR';

  // Housekeeping metrics
  const whHkStaff = (staff || []).filter((s) => s.warehouseId === targetWarehouse.id || s.warehouseId === 'wh-001');
  const whHkAreas = (areaStatuses || []).filter((a) => a.warehouseId === targetWarehouse.id || a.warehouseId === 'wh-001');
  const whHkTasks = (tasks || []).filter((t) => t.warehouseId === targetWarehouse.id || t.warehouseId === 'wh-001');
  const whHkToilets = (toiletLogs || []).filter((tl) => tl.warehouseId === targetWarehouse.id || tl.warehouseId === 'wh-001');
  const whHkGarbage = (garbageRecords || []).filter((g) => g.warehouseId === targetWarehouse.id || g.warehouseId === 'wh-001');
  const whHkInspections = (inspections || []).filter((ins) => ins.warehouseId === targetWarehouse.id || ins.warehouseId === 'wh-001');

  const hkPresentCount = whHkStaff.filter((s) => s.attendanceStatus === 'PRESENT').length;
  const hkAbsentCount = whHkStaff.filter((s) => s.attendanceStatus === 'ABSENT').length;
  const hkLeaveCount = whHkStaff.filter((s) => s.attendanceStatus === 'LEAVE').length;
  const hkMorningShift = whHkStaff.filter((s) => s.shift === 'Morning').length;
  const hkEveningShift = whHkStaff.filter((s) => s.shift === 'Evening').length;
  const hkNightShift = whHkStaff.filter((s) => s.shift === 'Night').length;
  const hkContractCount = whHkStaff.filter((s) => s.employmentType === 'Contract').length;
  const hkPermanentCount = whHkStaff.filter((s) => s.employmentType === 'Permanent').length;
  const hkAttendancePct = whHkStaff.length > 0 ? Math.round((hkPresentCount / whHkStaff.length) * 100) : 100;

  const completedTasksCount = whHkTasks.filter((t) => t.status === 'Completed').length;
  const pendingTasksCount = whHkTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const overdueTasksCount = whHkTasks.filter((t) => t.status === 'Overdue').length;
  const hkCompletionRate = whHkTasks.length > 0 ? Math.round((completedTasksCount / whHkTasks.length) * 100) : 100;

  const latestInspection = whHkInspections[0] || { cleanlinessScore: 96, safetyScore: 98, hygieneScore: 95 };

  // Filtered dataset for this warehouse
  const whEmployees = (employees || []).filter((e) => e.warehouseId === targetWarehouse.id || e.warehouseId === 'wh-001');
  const whDocs = (documents || []).filter((d) => d.warehouseId === targetWarehouse.id || d.warehouseId === 'wh-001');
  const whLogs = (activityLogs || []).filter((l) => l.warehouseId === targetWarehouse.id || l.warehouseId === 'wh-001');
  const whInventory = (inventoryItems || []).filter((i) => i.warehouseId === targetWarehouse.id || i.warehouseId === 'wh-001');
  const whAssets = (assets || []).filter((a) => a.warehouseId === targetWarehouse.id || a.warehouseId === 'wh-001');
  const whEquipments = (equipments || []).filter((eq) => eq.warehouseId === targetWarehouse.id || eq.warehouseId === 'wh-001');
  const whInbound = (inboundShipments || []).filter((inb) => inb.warehouseId === targetWarehouse.id || inb.warehouseId === 'wh-001');
  const whOutbound = (outboundOrders || []).filter((out) => out.warehouseId === targetWarehouse.id || out.warehouseId === 'wh-001');

  // Calculated Metrics
  const totalStockQty = whInventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalInvValue = totalStockQty * 450; // Estimated avg value
  const whiteCollarStaff = whEmployees.filter((e) => e.type === 'WHITE_COLLAR');
  const blueCollarStaff = whEmployees.filter((e) => e.type === 'BLUE_COLLAR');

  const presentCount = whEmployees.filter((e) => e.attendanceStatus === 'PRESENT').length;
  const absentCount = whEmployees.filter((e) => e.attendanceStatus === 'ABSENT').length;
  const leaveCount = whEmployees.filter((e) => e.attendanceStatus === 'LEAVE').length;
  const lateCount = whEmployees.filter((e) => e.attendanceStatus === 'LATE').length;
  const dayShiftCount = whEmployees.filter((e) => e.shift === 'Morning' || e.shift === 'Evening').length;
  const nightShiftCount = whEmployees.filter((e) => e.shift === 'Night').length;

  const filteredDocs = docFilterCategory === 'ALL' ? whDocs : whDocs.filter((d) => d.category === docFilterCategory);

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName) return;
    addDocument({
      warehouseId: targetWarehouse.id,
      fileName: docFileName.endsWith('.pdf') ? docFileName : `${docFileName}.pdf`,
      category: docCategory,
      uploadedBy: user?.name || 'Authorized Staff',
      version: docVersion,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      fileUrl: '#',
    });
    addActivityLog({
      warehouseId: targetWarehouse.id,
      user: user?.name || 'Authorized Staff',
      role: user?.role || 'WAREHOUSE_MANAGER',
      category: 'Document Uploaded',
      details: `Uploaded file ${docFileName} under category ${docCategory}`,
      ipAddress: '192.168.1.108',
    });
    setIsDocModalOpen(false);
    setDocFileName('');
  };

  const handleAddEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;
    addEmployee({
      warehouseId: targetWarehouse.id,
      employeeId: `EMP-${targetWarehouse.code.split('-')[1] || 'WMS'}-${Math.floor(100 + Math.random() * 900)}`,
      name: empName,
      type: empType,
      designation: empDesignation || (empType === 'WHITE_COLLAR' ? 'Operations Officer' : 'Floor Executive'),
      department: empDepartment,
      role: empType === 'WHITE_COLLAR' ? 'Supervisor' : 'Picker',
      shift: empShift,
      attendanceStatus: 'PRESENT',
      phone: empPhone,
      email: empEmail || `${empName.toLowerCase().replace(/\s+/g, '.')}@sankajlogistics.com`,
      experience: empExperience,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Permanent',
      assignedZone: empType === 'BLUE_COLLAR' ? 'Zone A' : undefined,
      currentTask: empType === 'BLUE_COLLAR' ? 'Active Staging' : undefined,
      skillLevel: empType === 'BLUE_COLLAR' ? 'Level 2' : undefined,
    });
    addActivityLog({
      warehouseId: targetWarehouse.id,
      user: user?.name || 'Warehouse Manager',
      role: user?.role || 'WAREHOUSE_MANAGER',
      category: 'Employee Added',
      details: `Registered new employee ${empName} (${empDesignation})`,
      ipAddress: '192.168.1.108',
    });
    setIsEmpModalOpen(false);
    setEmpName('');
  };

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    addInspection({
      warehouseId: targetWarehouse.id,
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName: `${user?.name || 'Priya Sundaram'} (${user?.role || 'Supervisor'})`,
      cleanlinessScore: Number(inspCleanliness),
      safetyScore: Number(inspSafety),
      hygieneScore: Number(inspHygiene),
      remarks: inspRemarks || 'Routine facility inspection completed successfully.',
      correctiveActions: inspCorrective || 'Maintain standard cleaning schedules.',
      status: 'APPROVED',
    });
    addActivityLog({
      warehouseId: targetWarehouse.id,
      user: user?.name || 'Supervisor',
      role: user?.role || 'SUPERVISOR',
      category: 'Maintenance Completed',
      details: `Performed Facility Housekeeping & Hygiene Inspection (Cleanliness Score: ${inspCleanliness}/100)`,
      ipAddress: '192.168.1.104',
    });
    setIsInspModalOpen(false);
  };

  const handleExportProfileReport = () => {
    const headers = ['Metric / Field', 'Details & Value'];
    const rows = [
      ['Warehouse Name', targetWarehouse.name],
      ['Warehouse Code', targetWarehouse.code],
      ['Company Entity', targetWarehouse.companyName || 'Sankaj Logistics Limited'],
      ['Manager', targetWarehouse.managerName || 'Rajesh Sharma'],
      ['Address', `${targetWarehouse.address}, ${targetWarehouse.city}, ${targetWarehouse.state}`],
      ['Capacity (Units)', targetWarehouse.capacity.toLocaleString()],
      ['Occupancy %', `${targetWarehouse.occupancy}%`],
      ['Storage Area', `${targetWarehouse.area.toLocaleString()} Sq. Ft.`],
      ['Total Employees', `${whEmployees.length} Staff`],
      ['Housekeeping Staff', `${whHkStaff.length} Cleaners`],
      ['Housekeeping Completion Rate', `${hkCompletionRate}%`],
      ['Latest Cleanliness Score', `${latestInspection.cleanlinessScore}/100`],
      ['Inventory SKUs', `${whInventory.length} SKUs`],
      ['Asset Items', `${whAssets.length} Industrial Assets`],
      ['Monthly Rental', `₹${targetWarehouse.rentalCost.toLocaleString()}/mo`],
    ];
    exportToPDF(`${targetWarehouse.code} - Complete Warehouse Profile & Facility Report`, headers, rows);
  };

  const tabList: { id: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <WarehouseIcon className="w-4 h-4" /> },
    { id: 'manpower', label: 'Manpower', icon: <Users className="w-4 h-4" />, count: whEmployees.length },
    { id: 'housekeeping', label: 'Housekeeping & Facility', icon: <Sparkles className="w-4 h-4 text-emerald-400" />, count: whHkTasks.length },
    { id: 'inventory', label: 'Inventory', icon: <Box className="w-4 h-4" />, count: whInventory.length },
    { id: 'assets', label: 'Assets', icon: <Layers className="w-4 h-4" />, count: whAssets.length },
    { id: 'equipment', label: 'Equipment (MHE)', icon: <Wrench className="w-4 h-4" />, count: whEquipments.length },
    { id: 'inbound', label: 'Inbound', icon: <Truck className="w-4 h-4" />, count: whInbound.length },
    { id: 'outbound', label: 'Outbound', icon: <Truck className="w-4 h-4" />, count: whOutbound.length },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" />, count: whDocs.length },
    { id: 'reports', label: 'Reports & KPIs', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity className="w-4 h-4" />, count: whLogs.length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link href="/dashboard/warehouses" className="hover:text-emerald-500 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Warehouse Hub
              </Link>
              <span>/</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{targetWarehouse.code}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-600/20">
                WH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{targetWarehouse.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {targetWarehouse.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {targetWarehouse.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {targetWarehouse.city}, {targetWarehouse.state}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportProfileReport}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Profile Report
            </button>
            {isSuperOrAdmin && (
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Document
              </button>
            )}
          </div>
        </div>

        {/* Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Occupancy Rate</p>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{targetWarehouse.occupancy}%</p>
            <p className="text-[10px] text-slate-500">{((targetWarehouse.capacity * targetWarehouse.occupancy) / 100).toLocaleString()} / {targetWarehouse.capacity.toLocaleString()} Units</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Storage Footprint</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{targetWarehouse.area.toLocaleString()} Sq. Ft.</p>
            <p className="text-[10px] text-slate-500">₹{targetWarehouse.rentalCost.toLocaleString()}/mo Rental</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Active Manpower</p>
            <p className="text-lg font-extrabold text-royal-600 dark:text-royal-400 mt-0.5">{whEmployees.length} Staff</p>
            <p className="text-[10px] text-slate-500">{presentCount} Present Today</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Facility Cleanliness Score</p>
            <p className="text-lg font-extrabold text-emerald-500 mt-0.5">{latestInspection.cleanlinessScore}/100</p>
            <p className="text-[10px] text-slate-500">{hkCompletionRate}% Tasks Completed</p>
          </div>
        </div>

        {/* 11 Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {tabList.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Warehouse Basic & General Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Building2 className="w-4 h-4 text-emerald-500" /> Identity & Ownership
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Warehouse Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">{targetWarehouse.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Warehouse Code</span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{targetWarehouse.code}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Parent Company</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{targetWarehouse.companyName || 'Sankaj Logistics Limited'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Warehouse Type</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">High-Bay Automated Fulfillment Hub</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className="font-bold uppercase text-emerald-500">{targetWarehouse.status}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-medium">Commissioning Date</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">2024-01-15</span>
                  </div>
                </div>
              </div>

              {/* Location & Contact Info */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <MapPin className="w-4 h-4 text-royal-500" /> Location & Management
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Warehouse Manager</span>
                    <span className="font-bold text-slate-900 dark:text-white">{targetWarehouse.managerName || 'Rajesh Sharma'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Manager Email</span>
                    <span className="font-semibold text-royal-600 dark:text-royal-400">rajesh.sharma@sankajlogistics.com</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">+91 22 4918 2000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">City / State</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{targetWarehouse.city}, {targetWarehouse.state} ({targetWarehouse.pinCode})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">GPS Coordinates</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">19.2812° N, 73.0489° E</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-medium">Working Hours</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{targetWarehouse.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Gauge className="w-4 h-4 text-amber-500" /> Infrastructure Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Gates</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">6 Entry/Exit</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Loading Docks</p>
                    <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">12 Docks</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Storage Zones</p>
                    <p className="text-base font-extrabold text-royal-600 dark:text-royal-400 mt-0.5">8 Zones</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Racks</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">140 Racks</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Bin Locations</p>
                    <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">3,500 Bins</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Parking Bays</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">18 Trailer Bays</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. MANPOWER TAB ==================== */}
        {activeTab === 'manpower' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Manpower Dashboard KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Approved Strength</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{whEmployees.length}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-emerald-500 uppercase font-bold">Present Today</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-rose-500 uppercase font-bold">Absent Today</p>
                <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{absentCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-amber-500 uppercase font-bold">On Leave</p>
                <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{leaveCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-indigo-500 uppercase font-bold">Late Arrivals</p>
                <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{lateCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-cyan-500 uppercase font-bold">Day Shift</p>
                <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">{dayShiftCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-purple-500 uppercase font-bold">Night Shift</p>
                <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{nightShiftCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-emerald-500 uppercase font-bold">Overtime</p>
                <p className="text-xl font-extrabold text-emerald-500 mt-1">2 Staff</p>
              </div>
            </div>

            {/* White Collar Staff Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-500" /> White Collar Staff ({whiteCollarStaff.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Management, Supervisors, Quality, HR, IT & Accounts Officers</p>
                </div>
                {isSuperOrAdmin && (
                  <button
                    onClick={() => {
                      setEmpType('WHITE_COLLAR');
                      setIsEmpModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Staff
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Emp ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Designation</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Shift</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Experience</th>
                      <th className="pb-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whiteCollarStaff.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{emp.employeeId}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{emp.designation}</td>
                        <td className="py-3 text-slate-500">{emp.department}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">{emp.shift}</span></td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {emp.attendanceStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{emp.experience}</td>
                        <td className="py-3 text-slate-500">{emp.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blue Collar Staff Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-amber-500" /> Blue Collar Operators & Ground Workforce ({blueCollarStaff.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Forklift Operators, Loaders, Packers, Pickers, Drivers & Security Guards</p>
                </div>
                {isSuperOrAdmin && (
                  <button
                    onClick={() => {
                      setEmpType('BLUE_COLLAR');
                      setIsEmpModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Worker
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Emp ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Role / Trade</th>
                      <th className="pb-3">Shift</th>
                      <th className="pb-3">Attendance</th>
                      <th className="pb-3">Assigned Zone</th>
                      <th className="pb-3">Current Task</th>
                      <th className="pb-3">Skill Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {blueCollarStaff.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">{emp.employeeId}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{emp.role}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">{emp.shift}</span></td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {emp.attendanceStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-semibold">{emp.assignedZone || 'Zone A'}</td>
                        <td className="py-3 text-slate-500">{emp.currentTask || 'Active Staging'}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-bold text-[10px]">{emp.skillLevel || 'Level 2'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. HOUSEKEEPING & FACILITY MANAGEMENT TAB ==================== */}
        {activeTab === 'housekeeping' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Dashboard Summary Widget & KPI Cards */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" /> Housekeeping & Facility Management Command Center
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time monitoring of sanitation, 16 area cleaning statuses, daily checklist, toilet hygiene, garbage disposal & supervisor audits.
                  </p>
                </div>
                {isSupervisor && (
                  <button
                    onClick={() => setIsInspModalOpen(true)}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all"
                  >
                    <ClipboardCheck className="w-4 h-4" /> Perform Supervisor Inspection
                  </button>
                )}
              </div>

              {/* 13 Comprehensive Housekeeping KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total HK Staff</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{whHkStaff.length}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-emerald-500 uppercase font-bold">Present Today</p>
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{hkPresentCount}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-rose-500 uppercase font-bold">Absent / Leave</p>
                  <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{hkAbsentCount + hkLeaveCount}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-cyan-500 uppercase font-bold">Morning Shift</p>
                  <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">{hkMorningShift}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-purple-500 uppercase font-bold">Eve / Night Shift</p>
                  <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{hkEveningShift + hkNightShift}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Contract / Perm</p>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">{hkContractCount} / {hkPermanentCount}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-emerald-500 uppercase font-bold">Attendance %</p>
                  <p className="text-xl font-extrabold text-emerald-500 mt-1">{hkAttendancePct}%</p>
                </div>
              </div>

              {/* Progress & Live Task Summary Strip */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Cleaning Completion Rate</span>
                    <span>{hkCompletionRate}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${hkCompletionRate}%` }} />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Completed Tasks</p>
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{completedTasksCount} / {whHkTasks.length}</p>
                  </div>
                  <CheckSquare className="w-6 h-6 text-emerald-500" />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-amber-500 uppercase font-bold">Pending / Overdue</p>
                    <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{pendingTasksCount} Pending ({overdueTasksCount} Overdue)</p>
                  </div>
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-royal-500 uppercase font-bold">Inspection Score</p>
                    <p className="text-lg font-extrabold text-royal-600 dark:text-royal-400 mt-0.5">{latestInspection.cleanlinessScore} / 100</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-royal-500" />
                </div>
              </div>
            </div>

            {/* SECTION 1: HOUSEKEEPING STAFF REGISTER */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" /> Dedicated Housekeeping Staff & Attendance Register
                  </h3>
                  <p className="text-xs text-slate-500">Staff roles, shift schedules, assigned cleaning zones & live task statuses</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Emp ID</th>
                      <th className="pb-3">Employee Name</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Shift</th>
                      <th className="pb-3">Attendance</th>
                      <th className="pb-3">Assigned Area</th>
                      <th className="pb-3">Supervisor</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Current Task</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whHkStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{staff.employeeId}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{staff.name}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{staff.role}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">{staff.shift}</span></td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {staff.attendanceStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300 font-semibold">{staff.assignedArea}</td>
                        <td className="py-3 text-slate-500">{staff.supervisor}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">{staff.employmentType}</span></td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">{staff.currentTask}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            staff.taskStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {staff.taskStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: AREA-WISE CLEANING STATUS (16 WAREHOUSE AREAS) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" /> Area-Wise Sanitation & Cleaning Tracker (16 Facility Zones)
                  </h3>
                  <p className="text-xs text-slate-500">Live sanitation state across all 16 warehouse zones from Dock to Office</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {whHkAreas.map((area) => (
                  <div key={area.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{area.areaName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        area.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        area.status === 'In Progress' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
                        area.status === 'Overdue' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {area.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <p>Last Cleaned: <strong className="text-slate-800 dark:text-slate-200">{area.lastCleaned}</strong></p>
                      <p>Next Scheduled: <strong className="text-emerald-600 dark:text-emerald-400">{area.nextScheduled}</strong></p>
                      <p>Cleaner: <strong className="text-slate-700 dark:text-slate-300">{area.assignedEmployee}</strong></p>
                    </div>

                    <p className="text-[10px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{area.remarks}"
                    </p>

                    {isSupervisor && (
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => updateAreaStatus(area.id, 'Completed')}
                          className="flex-1 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                        >
                          Mark Cleaned
                        </button>
                        <button
                          onClick={() => updateAreaStatus(area.id, 'In Progress')}
                          className="flex-1 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-lg transition-colors"
                        >
                          In Progress
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: DAILY CLEANING CHECKLIST (19 TASKS) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-500" /> Daily Master Cleaning & Hygiene Checklist (19 Tasks)
                  </h3>
                  <p className="text-xs text-slate-500">Sweeping, mopping, rack vacuuming, equipment degreasing, waste disposal & sanitization</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Task Name</th>
                      <th className="pb-3">Assigned Staff</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Scheduled</th>
                      <th className="pb-3">Completed</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Photos (Before / After)</th>
                      <th className="pb-3">Remarks</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whHkTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{t.taskName}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{t.assignedStaff}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{t.scheduledTime}</td>
                        <td className="py-3 font-mono text-slate-700 dark:text-slate-300">{t.completionTime}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            t.status === 'In Progress' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
                            t.status === 'Overdue' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            📷 {t.photosBefore || 'Verified'} / {t.photosAfter || 'Verified'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-[180px] truncate">{t.remarks}</td>
                        <td className="py-3">
                          {t.status !== 'Completed' && isSupervisor && (
                            <button
                              onClick={() => updateTaskStatus(t.id, 'Completed')}
                              className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: TOILET CLEANING & CONSUMABLES STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-500" /> Washroom Sanitation & Frequency Log
                </h3>

                <div className="space-y-4">
                  {whHkToilets.map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.location}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Inspection: {t.inspectionStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div><span className="text-[10px] text-slate-400 block">Total Units</span><strong className="text-slate-900 dark:text-white">{t.totalToilets} Toilets</strong></div>
                        <div><span className="text-[10px] text-slate-400 block">Cleaned Today</span><strong className="text-emerald-600">{t.cleanedToday} Cleaned</strong></div>
                        <div><span className="text-[10px] text-slate-400 block">Frequency</span><strong className="text-cyan-600">{t.frequency}</strong></div>
                        <div><span className="text-[10px] text-slate-400 block">Last Cleaned</span><strong className="text-slate-800 dark:text-slate-200">{t.lastCleanedTime}</strong></div>
                      </div>

                      {/* Consumables Meters */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-5 gap-2 text-[10px] font-semibold text-center">
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block">Soap</span>
                          <span className="text-emerald-500 font-bold">{t.consumables.soap}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block">Tissue</span>
                          <span className="text-emerald-500 font-bold">{t.consumables.tissuePaper}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block">Hand Wash</span>
                          <span className="text-emerald-500 font-bold">{t.consumables.handWash}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block">Air Freshener</span>
                          <span className="text-cyan-500 font-bold">{t.consumables.airFreshener}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block">Sanitizer</span>
                          <span className="text-emerald-500 font-bold">{t.consumables.sanitizer}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: GARBAGE & SCRAP MANAGEMENT */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trash className="w-5 h-5 text-amber-500" /> Garbage & Scrap Disposal Log
                </h3>

                <div className="space-y-3">
                  {whHkGarbage.map((g) => (
                    <div key={g.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white">{g.wasteType}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {g.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Weight: <strong className="text-amber-600 dark:text-amber-400">{g.weightKg} kg</strong> • Collected by {g.collectedBy}
                      </p>
                      <p className="text-[10px] text-slate-400">Method: {g.disposalMethod}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Vendor: {g.vendor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 6: SUPERVISOR INSPECTIONS & SCORECARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-royal-500" /> Facility Supervisor Audits & Hygiene Scorecards
              </h3>

              <div className="space-y-4">
                {whHkInspections.map((insp) => (
                  <div key={insp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {insp.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{insp.inspectorName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{insp.inspectionDate}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-bold">Cleanliness Score</span>
                        <span className="text-lg font-extrabold text-emerald-500">{insp.cleanlinessScore} / 100</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-bold">Safety Score</span>
                        <span className="text-lg font-extrabold text-royal-500">{insp.safetyScore} / 100</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-bold">Hygiene Score</span>
                        <span className="text-lg font-extrabold text-cyan-500">{insp.hygieneScore} / 100</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">"{insp.remarks}"</p>
                    <p className="text-[11px] text-slate-500">Corrective Actions: <strong className="text-slate-800 dark:text-slate-200">{insp.correctiveActions}</strong></p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: HOUSEKEEPING REPORTS GENERATOR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Export Housekeeping & Facility Management Reports
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  'Daily Cleaning Report',
                  'Weekly Housekeeping Report',
                  'Monthly Hygiene Report',
                  'Housekeeping Attendance Report',
                  'Garbage Disposal Report',
                  'Inspection Audit Report',
                ].map((repName, i) => (
                  <button
                    key={i}
                    onClick={() => handleExportProfileReport()}
                    className="p-3 text-left rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all space-y-2 group"
                  >
                    <Download className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{repName}</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Download PDF</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. INVENTORY TAB ==================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total SKUs</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{whInventory.length} SKUs</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Stock</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{totalStockQty.toLocaleString()} Units</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Est. Stock Value</p>
                <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">₹{(totalInvValue / 100000).toFixed(1)} Lakhs</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Cycle Count Accuracy</p>
                <p className="text-xl font-extrabold text-royal-600 dark:text-royal-400 mt-1">99.4%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-emerald-500" /> Warehouse Inventory Register
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">SKU Code</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Location (Rack/Shelf/Bin)</th>
                      <th className="pb-3">Available</th>
                      <th className="pb-3">Reserved</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.sku}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{item.productName}</td>
                        <td className="py-3 text-slate-500">{item.category}</td>
                        <td className="py-3 font-mono text-slate-700 dark:text-slate-300">R-{item.rack} / S-{item.shelf} / B-{item.bin}</td>
                        <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400">{item.available}</td>
                        <td className="py-3 text-slate-400">{item.reserved}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. ASSETS TAB ==================== */}
        {activeTab === 'assets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-royal-500" /> Industrial Assets Register
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Asset ID</th>
                      <th className="pb-3">Asset Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Assigned Employee</th>
                      <th className="pb-3">Purchase Date</th>
                      <th className="pb-3">Condition</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whAssets.map((ast) => (
                      <tr key={ast.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-royal-600 dark:text-royal-400">{ast.assetCustomId}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{ast.name}</td>
                        <td className="py-3 text-slate-500">{ast.category}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{ast.assignedEmployeeName || 'Unassigned'}</td>
                        <td className="py-3 text-slate-500">{ast.purchaseDate}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">{ast.condition}</span></td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            OPERATIONAL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. MHE EQUIPMENT TAB ==================== */}
        {activeTab === 'equipment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whEquipments.map((eq) => (
                <div key={eq.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{eq.equipmentCode}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                      {eq.healthStatus}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{eq.name}</h4>
                  <p className="text-xs text-slate-500">Operator: <strong className="text-slate-800 dark:text-slate-200">{eq.operatorName}</strong></p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>Battery Status</span>
                      <span>{eq.batteryStatus}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${eq.batteryStatus}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 7. INBOUND TAB ==================== */}
        {activeTab === 'inbound' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-royal-500" /> Inbound Receiving Register
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Shipment Code</th>
                      <th className="pb-3">Supplier Name</th>
                      <th className="pb-3">Vehicle Number</th>
                      <th className="pb-3">Dock</th>
                      <th className="pb-3">Total Items</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whInbound.map((inb) => (
                      <tr key={inb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-royal-600 dark:text-royal-400">{inb.shipmentCode}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{inb.supplierName}</td>
                        <td className="py-3 font-mono text-slate-700 dark:text-slate-300">{inb.vehicleNumber}</td>
                        <td className="py-3 text-slate-500">{inb.dockNumber}</td>
                        <td className="py-3 font-bold text-emerald-600">{inb.totalItems} Units</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                            {inb.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 8. OUTBOUND TAB ==================== */}
        {activeTab === 'outbound' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" /> Outbound Dispatch Register
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3">Order Code</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Invoice No</th>
                      <th className="pb-3">Picking Type</th>
                      <th className="pb-3">Total Items</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {whOutbound.map((out) => (
                      <tr key={out.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{out.orderCode}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{out.customer}</td>
                        <td className="py-3 font-mono text-slate-700 dark:text-slate-300">{out.invoiceNo}</td>
                        <td className="py-3 text-slate-500">{out.pickingType}</td>
                        <td className="py-3 font-bold text-indigo-600">{out.totalItems} Units</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {out.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 9. DOCUMENTS TAB ==================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Upload Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 uppercase">Category:</span>
                {['ALL', 'Warehouse Registration', 'Lease Agreement', 'Fire NOC', 'Warehouse Layout Drawings', 'ISO Certificates', 'Safety SOPs'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDocFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      docFilterCategory === cat
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isSuperOrAdmin && (
                <button
                  onClick={() => setIsDocModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-md shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload New File
                </button>
              )}
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {doc.version}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={doc.fileName}>{doc.fileName}</h4>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{doc.category}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Uploaded by <strong>{doc.uploadedBy}</strong> on {doc.uploadDate} ({doc.size})</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Downloading ${doc.fileName}...`)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {isSuperOrAdmin && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 10. REPORTS TAB ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Facility Occupancy Report', desc: 'Storage area utilization, capacity meters, and bin occupancy metrics.', type: 'Occupancy' },
                { title: 'Inventory Valuation Report', desc: 'SKU valuation, fast/slow moving classification, and stock counts.', type: 'Inventory' },
                { title: 'Manpower Attendance Report', desc: 'Shift headcounts, white/blue collar strength, and overtime summary.', type: 'Manpower' },
                { title: 'Housekeeping & Facility Audit Report', desc: 'Sanitation metrics, 16 area cleanings, checklist completion & hygiene scores.', type: 'Housekeeping' },
                { title: 'Asset & Maintenance Report', desc: 'Equipment health, battery levels, maintenance schedules, and warranties.', type: 'Asset' },
                { title: 'MHE Equipment Utilization', desc: 'Forklift and reach truck hours, downtime logs, and service status.', type: 'Equipment' },
                { title: 'Monthly KPI Performance', desc: 'Dock turnaround SLA, GRN throughput, and order picking accuracy.', type: 'KPI' },
              ].map((rep, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{rep.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
                  </div>
                  <button
                    onClick={() => handleExportProfileReport()}
                    className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download {rep.type} PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 11. ACTIVITY LOG TAB ==================== */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> Real-time Warehouse Audit & Activity Feed
              </h3>

              <div className="space-y-4 pt-2">
                {whLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{log.user} <span className="text-slate-400 font-normal">({log.role})</span></span>
                        <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{log.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">{log.category}</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-500" /> Upload Warehouse Document
              </h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Document Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {[
                    'Warehouse Registration',
                    'Lease Agreement',
                    'Insurance',
                    'GST',
                    'Fire NOC',
                    'Factory License',
                    'ISO Certificates',
                    'Audit Reports',
                    'Warehouse Layout Drawings',
                    'Safety SOPs',
                    'Vendor Contracts',
                    'Equipment Manuals',
                    'Images',
                    'Videos',
                    'Other Documents',
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">File Name</label>
                <input
                  type="text"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  placeholder="e.g. WH-MUM-01_Fire_NOC_Renewal_2026.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Drag & Drop simulated box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">Drag and drop file here or click to browse</p>
                <p className="text-[10px] text-slate-400">Supports PDF, DOCX, XLSX, JPG, PNG, ZIP (Max 50MB)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-md"
                >
                  Upload & Register File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{previewDoc.fileName}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2 text-emerald-400 font-bold">
                <span>FILE PREVIEW MODULE</span>
                <span>{previewDoc.version}</span>
              </div>
              <p>Category: {previewDoc.category}</p>
              <p>Uploaded By: {previewDoc.uploadedBy} on {previewDoc.uploadDate}</p>
              <p>File Size: {previewDoc.size}</p>
              <div className="p-4 bg-slate-900 rounded-xl text-slate-400 text-center italic mt-4">
                [ Document Digital Signature Verified • Official Confidential Record ]
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perform Housekeeping Inspection Modal */}
      {isInspModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-500" /> Perform Facility Supervisor Audit
              </h3>
              <button onClick={() => setIsInspModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInspection} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Cleanliness Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inspCleanliness}
                  onChange={(e) => setInspCleanliness(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Safety Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inspSafety}
                    onChange={(e) => setInspSafety(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Hygiene Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inspHygiene}
                    onChange={(e) => setInspHygiene(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Supervisor Audit Remarks</label>
                <textarea
                  value={inspRemarks}
                  onChange={(e) => setInspRemarks(e.target.value)}
                  placeholder="e.g. Excellent sanitation compliance across Dock 1-12 and Storage Zone B."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-20"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Corrective Actions Required</label>
                <input
                  type="text"
                  value={inspCorrective}
                  onChange={(e) => setInspCorrective(e.target.value)}
                  placeholder="e.g. Ensure parking sweeper truck run completes before noon."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInspModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-md"
                >
                  Submit & Approve Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Register {empType === 'WHITE_COLLAR' ? 'White Collar Staff' : 'Blue Collar Operator'}
              </h3>
              <button onClick={() => setIsEmpModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmp} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                    placeholder="e.g. Operations Manager"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Shift</label>
                  <select
                    value={empShift}
                    onChange={(e) => setEmpShift(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-md"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
