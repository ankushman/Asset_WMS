import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const CATEGORY_MAP: Record<string, string> = {
  Forklift: 'FORK',
  Laptop: 'LAP',
  Printer: 'PRN',
  Scanner: 'SCN',
  Conveyor: 'CNV',
  Generator: 'GEN',
  'CCTV Camera': 'CCTV',
  Camera: 'CCTV',
  'Air Conditioner': 'AC',
  AC: 'AC',
  Desktop: 'DSK',
  Tools: 'TOOL',
  Furniture: 'FURN',
  Other: 'OTH',
};

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  generateNextAssetId(categoryName: string, existingList: any[]): string {
    const code = CATEGORY_MAP[categoryName] || categoryName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'AST';
    const prefix = `AST-${code}-`;

    let maxSeq = 0;
    existingList.forEach((ast) => {
      const customId = ast.assetCustomId || '';
      if (customId.toUpperCase().startsWith(prefix)) {
        const match = customId.match(/AST-[A-Z0-9]+-(\d+)/i);
        if (match && match[1]) {
          const seq = parseInt(match[1], 10);
          if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
        }
      }
    });

    const nextSeq = maxSeq + 1;
    return `AST-${code}-${nextSeq.toString().padStart(3, '0')}`;
  }

  async findAll() {
    try {
      const dbAssets = await this.prisma.asset.findMany({
        where: { deletedAt: null },
        include: { warehouse: true },
      });
      if (dbAssets.length > 0) return dbAssets;
    } catch (e) {}

    return [
      {
        id: 'ast-001',
        assetCustomId: 'AST-FORK-001',
        name: 'Toyota 3-Ton Heavy Forklift 8FGU25',
        category: 'Forklift',
        barcode: 'BC-AST-882101',
        qrCode: 'QR-AST-FORK-001',
        serialNumber: 'SN-TYT-90412-MUM',
        purchaseDate: '2024-03-15',
        purchaseCost: 2850000,
        vendor: 'Toyota Material Handling India',
        warrantyExpiry: '2027-03-15',
        warehouseId: 'wh-001',
        warehouseName: 'Mumbai Central Mega Hub',
        assignedEmployeeName: 'Priya Sundaram',
        condition: 'IN_USE',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
        createdAt: '2025-01-15T12:00:00Z',
      },
      {
        id: 'ast-002',
        assetCustomId: 'AST-SCN-104',
        name: 'Zebra TC52 Industrial Android Barcode Scanner',
        category: 'Scanner',
        barcode: 'BC-AST-773012',
        qrCode: 'QR-AST-SCN-104',
        serialNumber: 'ZBR-TC52-44091',
        purchaseDate: '2024-06-10',
        purchaseCost: 75000,
        vendor: 'Zebra Technologies Corp',
        warrantyExpiry: '2026-06-10',
        warehouseId: 'wh-001',
        warehouseName: 'Mumbai Central Mega Hub',
        assignedEmployeeName: 'Rohan Deshmukh',
        condition: 'AVAILABLE',
        image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=400&q=80',
        createdAt: '2025-01-18T10:30:00Z',
      },
      {
        id: 'ast-003',
        assetCustomId: 'AST-PRN-055',
        name: 'Zebra ZT411 Industrial Thermal Label Printer',
        category: 'Printer',
        barcode: 'BC-AST-664099',
        qrCode: 'QR-AST-PRN-055',
        serialNumber: 'SN-ZBR-ZT411-88',
        purchaseDate: '2024-08-20',
        purchaseCost: 145000,
        vendor: 'PrintTech Solutions India',
        warrantyExpiry: '2026-08-20',
        warehouseId: 'wh-002',
        warehouseName: 'Delhi North Logistics Park',
        assignedEmployeeName: 'Suresh Patil',
        condition: 'IN_USE',
        image: 'https://images.unsplash.com/photo-1612815150548-9968a3562479?auto=format&fit=crop&w=400&q=80',
        createdAt: '2025-01-20T11:45:00Z',
      },
      {
        id: 'ast-004',
        assetCustomId: 'AST-LAP-901',
        name: 'Dell Precision 7680 Workstation i9 64GB',
        category: 'Laptop',
        barcode: 'BC-AST-110293',
        qrCode: 'QR-AST-LAP-901',
        serialNumber: 'DELL-PR76-MUM-01',
        purchaseDate: '2024-11-05',
        purchaseCost: 220000,
        vendor: 'Dell India Enterprise',
        warrantyExpiry: '2027-11-05',
        warehouseId: 'wh-001',
        warehouseName: 'Mumbai Central Mega Hub',
        assignedEmployeeName: 'Rajesh Sharma',
        condition: 'IN_USE',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
        createdAt: '2025-01-25T08:20:00Z',
      },
    ];
  }

  async create(data: any) {
    const list = await this.findAll();
    const autoAssetId = this.generateNextAssetId(data.category || 'Forklift', list);

    const assetToSave = {
      id: `ast-${Date.now()}`,
      assetCustomId: autoAssetId,
      barcode: `BC-${autoAssetId}`,
      qrCode: `QR-${autoAssetId}`,
      createdAt: new Date().toISOString(),
      ...data,
    };

    try {
      return await this.prisma.asset.create({ data: assetToSave });
    } catch (e) {
      return assetToSave;
    }
  }

  async getNextId(category: string) {
    const list = await this.findAll();
    return {
      category,
      nextAssetId: this.generateNextAssetId(category, list),
    };
  }
}
