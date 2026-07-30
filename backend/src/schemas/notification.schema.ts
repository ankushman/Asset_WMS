import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkflowNotificationDocument = WorkflowNotification & Document;

@Schema({ timestamps: true })
export class WorkflowNotification {
  @Prop({ required: true })
  userId: string;

  @Prop()
  companyId: string;

  @Prop({ default: 'SYSTEM_ALERT' })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  requestId: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  link: string;
}

export const WorkflowNotificationSchema = SchemaFactory.createForClass(WorkflowNotification);
