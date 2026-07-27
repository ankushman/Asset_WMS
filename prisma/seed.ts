import { PrismaClient, Role, CompanyStatus, WarehouseStatus, AssetCondition, InventoryStatus, WorkflowStatus, TripStatus, EquipmentType, ApprovalCategory, ApprovalStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sankaj Logistics Limited Database...');

  const passwordHash = bcrypt.hashSync('Password@123', 10);

  // 1. Company
  const company1 = await prisma.company.upsert({
    where: { gstNumber: '27AAACS1234F1Z5' },
    update: {},
    create: {
      name: 'Sankaj Logistics Limited',
      gstNumber: '27AAACS1234F1Z5',
      address: 'Suite 401, Apex Financial Tower, BKC',
      phone: '+91 22 4918 2000',
      email: 'corp@sankajlogistics.com',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
      status: CompanyStatus.ACTIVE,
    },
  });

  // 2. Warehouse
  const wh1 = await prisma.warehouse.upsert({
    where: { code: 'WH-MUM-01' },
    update: {},
    create: {
      code: 'WH-MUM-01',
      name: 'Mumbai Central Mega Hub',
      address: 'Bhiwandi Logistics Zone, Bldg 4',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pinCode: '421302',
      capacity: 75000,
      area: 120000,
      workingHours: '24/7 Operations',
      rentalCost: 450000,
      status: WarehouseStatus.ACTIVE,
      companyId: company1.id,
    },
  });

  // 3. User
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@sankajlogistics.com' },
    update: {},
    create: {
      name: 'Super Admin User',
      email: 'admin@sankajlogistics.com',
      passwordHash,
      phone: '+91 98765 43210',
      role: Role.SUPER_ADMIN,
      companyId: company1.id,
      warehouseId: wh1.id,
      status: true,
      emailVerified: true,
    },
  });

  // 4. Extensions
  await prisma.aiRecommendation.create({
    data: {
      category: 'INVENTORY',
      title: 'Transfer 300 Pallet Units of Hydraulic Fluid to Delhi Hub',
      reason: 'Delhi Logistics Park has an impending stockout risk of 88% due to peak Q3 manufacturing demand in North Zone.',
      expectedImpact: 'Prevents 4-day line stoppage for Mahindra Auto Parts.',
      confidenceScore: 96,
      priority: 'CRITICAL',
      costSavings: 185000,
    },
  });

  await prisma.workflowRule.create({
    data: {
      name: 'Auto-Create Purchase Req on Low Inventory',
      trigger: 'LOW_STOCK',
      condition: 'Available Stock < Safety Min Level',
      action: 'CREATE_PURCHASE_REQ',
      isActive: true,
    },
  });

  await prisma.integrationConnector.upsert({
    where: { systemName: 'SAP_S4HANA' },
    update: {},
    create: {
      systemName: 'SAP_S4HANA',
      category: 'ERP',
      status: 'CONNECTED',
      apiEndpoint: 'https://sap-api.sankajlogistics.com/v1/so-grn',
      syncFrequency: 'Real-Time Webhook',
    },
  });

  await prisma.iotDevice.upsert({
    where: { deviceCode: 'RFID-GATE-A1' },
    update: {},
    create: {
      deviceCode: 'RFID-GATE-A1',
      deviceType: 'RFID',
      warehouseId: wh1.id,
      batteryLevel: 98,
      status: 'ONLINE',
      telemetryData: '142 Tags read / sec',
    },
  });

  console.log('Phase 3 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
