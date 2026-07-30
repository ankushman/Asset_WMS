import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  location: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop({ default: 0 })
  capacitySqFt: number;

  @Prop({ default: 0 })
  currentUtilizationPct: number;

  @Prop()
  managerName: string;

  @Prop()
  contactPhone: string;

  @Prop({ default: 'ACTIVE' })
  status: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
