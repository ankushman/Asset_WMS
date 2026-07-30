import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PurchaseOrderDocument = PurchaseOrder & Document;

@Schema({ timestamps: true })
export class PurchaseOrder {
  @Prop({ required: true, unique: true })
  poNumber: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  vendorName: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 'DRAFT' })
  status: string;

  @Prop()
  expectedDeliveryDate: Date;

  @Prop({ type: Array, default: [] })
  items: any[];
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
