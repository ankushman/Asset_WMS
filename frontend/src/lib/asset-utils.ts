import { MockAsset } from './mock-data';

export const CATEGORY_CODE_MAP: Record<string, string> = {
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
  HVAC: 'AC',
  Desktop: 'DSK',
  Tools: 'TOOL',
  Furniture: 'FURN',
  Other: 'OTH',
  'Pallet Jack': 'PAL',
  Racking: 'RACK',
  Vehicle: 'VEH',
};

export function getCategoryCode(categoryName: string): string {
  if (!categoryName) return 'AST';

  if (CATEGORY_CODE_MAP[categoryName]) {
    return CATEGORY_CODE_MAP[categoryName];
  }

  const matchedKey = Object.keys(CATEGORY_CODE_MAP).find(
    (k) => k.toLowerCase() === categoryName.toLowerCase()
  );
  if (matchedKey) return CATEGORY_CODE_MAP[matchedKey];

  const cleaned = categoryName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (cleaned.length >= 3) {
    return cleaned.slice(0, 4);
  }
  return (cleaned + 'AST').slice(0, 3);
}

export function generateNextAssetId(categoryName: string, existingAssets: MockAsset[]): string {
  const code = getCategoryCode(categoryName);
  const prefix = `AST-${code}-`;

  let maxSeq = 0;

  existingAssets.forEach((asset) => {
    const customId = asset.assetCustomId || '';

    const isSameCategory = asset.category?.toLowerCase() === categoryName.toLowerCase();
    const hasMatchingPrefix = customId.toUpperCase().startsWith(prefix);

    if (isSameCategory || hasMatchingPrefix) {
      const match = customId.match(/AST-[A-Z0-9]+-(\d+)/i);
      if (match && match[1]) {
        const seq = parseInt(match[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  });

  const nextSeq = maxSeq + 1;
  const paddedSeq = nextSeq.toString().padStart(3, '0');
  return `AST-${code}-${paddedSeq}`;
}
