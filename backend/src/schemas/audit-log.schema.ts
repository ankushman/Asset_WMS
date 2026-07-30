import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogRecordDocument = AuditLogRecord & Document;

@Schema({ timestamps: true })
export class AuditLogRecord {
  @Prop({ required: true })
  performedBy: string;

  @Prop({ required: true })
  performedByName: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  targetUser: string;

  @Prop()
  targetUserName: string;

  @Prop({ required: true })
  action: string;

  @Prop()
  details: string;

  @Prop()
  ipAddress: string;
}

export const AuditLogRecordSchema = SchemaFactory.createForClass(AuditLogRecord);
