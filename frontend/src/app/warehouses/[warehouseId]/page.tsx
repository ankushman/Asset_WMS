import { redirect } from 'next/navigation';

export default async function WarehouseRedirectPage({ params }: { params: Promise<{ warehouseId: string }> }) {
  const resolvedParams = await params;
  redirect(`/dashboard/warehouses/${resolvedParams.warehouseId}`);
}
