import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true, unique: true })
  assetCode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  category: string;

  @Prop()
  warehouseId: string;

  @Prop()
  location: string;

  @Prop({ default: 'AVAILABLE' })
  condition: string;

  @Prop({ default: 0 })
  value: number;

  @Prop()
  serialNumber: string;

  @Prop()
  modelNumber: string;

  @Prop()
  assignedToUser: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
