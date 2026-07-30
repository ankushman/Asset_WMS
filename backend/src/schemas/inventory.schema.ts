import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  warehouseId: string;

  @Prop()
  category: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  reorderLevel: number;

  @Prop({ default: 0 })
  unitPrice: number;

  @Prop({ default: 'IN_STOCK' })
  status: string;

  @Prop()
  locationBin: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
