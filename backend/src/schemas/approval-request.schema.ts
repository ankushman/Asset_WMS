import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApprovalRequestV2Document = ApprovalRequestV2 & Document;

@Schema({ _id: false })
export class ApprovalLevelStatusSub {
  @Prop({ required: true })
  levelOrder: number;

  @Prop({ required: true })
  levelName: string;

  @Prop({ required: true })
  approverRole: string;

  @Prop()
  approverId: string;

  @Prop()
  approverName: string;

  @Prop({ default: 'PENDING_APPROVAL' })
  status: string;

  @Prop()
  comments: string;

  @Prop()
  decidedAt: Date;
}

@Schema({ _id: false })
export class ApprovalHistoryRecordSub {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop()
  userRole: string;

  @Prop()
  levelOrder: number;

  @Prop()
  previousStatus: string;

  @Prop()
  newStatus: string;

  @Prop()
  comments: string;

  @Prop()
  metadata: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class ApprovalRequestV2 {
  @Prop({ required: true, unique: true })
  requestCode: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  warehouseId: string;

  @Prop()
  warehouseName: string;

  @Prop()
  workflowDefinitionId: string;

  @Prop({ required: true })
  workflowType: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  module: string;

  @Prop()
  requestData: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 'MEDIUM' })
  priority: string;

  @Prop({ default: 0 })
  currentLevel: number;

  @Prop({ default: 1 })
  totalLevels: number;

  @Prop({ default: 'DRAFT' })
  status: string;

  @Prop({ default: 'NONE' })
  escalationStatus: string;

  @Prop({ required: true })
  makerUserId: string;

  @Prop({ required: true })
  makerUserName: string;

  @Prop()
  currentApproverId: string;

  @Prop()
  currentApproverName: string;

  @Prop({ type: [ApprovalLevelStatusSub], default: [] })
  levelStatuses: ApprovalLevelStatusSub[];

  @Prop({ type: [ApprovalHistoryRecordSub], default: [] })
  approvalHistory: ApprovalHistoryRecordSub[];

  @Prop()
  submittedAt: Date;

  @Prop()
  completedAt: Date;
}

export const ApprovalRequestV2Schema = SchemaFactory.createForClass(ApprovalRequestV2);
