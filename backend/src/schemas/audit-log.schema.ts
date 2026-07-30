import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogRecordDocument = AuditLogRecord & Document;

@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLogRecord {
  @Prop({ index: true })
  userId: string;

  @Prop()
  userName: string;

  @Prop({ index: true })
  companyId: string;

  @Prop({ required: true, index: true })
  action: string;

  @Prop({ index: true })
  module: string;

  @Prop({ index: true })
  entityId: string;

  @Prop()
  details: string;

  @Prop({ type: Object })
  oldValues: Record<string, any>;

  @Prop({ type: Object })
  newValues: Record<string, any>;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;
}

export const AuditLogRecordSchema = SchemaFactory.createForClass(AuditLogRecord);
AuditLogRecordSchema.index({ companyId: 1, createdAt: -1 });
AuditLogRecordSchema.index({ userId: 1, createdAt: -1 });
AuditLogRecordSchema.index({ module: 1, action: 1 });
