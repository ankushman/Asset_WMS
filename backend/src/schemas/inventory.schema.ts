import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true, unique: true, index: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ index: true })
  warehouseId: string;

  @Prop({ index: true })
  category: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  reorderLevel: number;

  @Prop({ default: 0 })
  unitPrice: number;

  @Prop({ default: 'IN_STOCK', index: true })
  status: string;

  @Prop()
  locationBin: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
InventoryItemSchema.index({ companyId: 1, warehouseId: 1 });
InventoryItemSchema.index({ sku: 1, companyId: 1 });
