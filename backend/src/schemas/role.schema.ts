import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleRecordDocument = RoleRecord & Document;

@Schema({ timestamps: true })
export class RoleRecord {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

export const RoleRecordSchema = SchemaFactory.createForClass(RoleRecord);
