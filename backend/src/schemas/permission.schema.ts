import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionRecordDocument = PermissionRecord & Document;

@Schema({ timestamps: true })
export class PermissionRecord {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  module: string;

  @Prop()
  description: string;
}

export const PermissionRecordSchema = SchemaFactory.createForClass(PermissionRecord);
