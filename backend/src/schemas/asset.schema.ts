import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true, unique: true, index: true })
  assetCode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ index: true })
  category: string;

  @Prop({ index: true })
  warehouseId: string;

  @Prop()
  location: string;

  @Prop({ default: 'AVAILABLE', index: true })
  condition: string;

  @Prop({ default: 0 })
  value: number;

  @Prop({ index: true })
  serialNumber: string;

  @Prop()
  modelNumber: string;

  @Prop({ index: true })
  assignedToUser: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
AssetSchema.index({ companyId: 1, warehouseId: 1 });
AssetSchema.index({ companyId: 1, condition: 1 });
