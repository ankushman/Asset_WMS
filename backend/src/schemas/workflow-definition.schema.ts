import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkflowDefinitionDocument = WorkflowDefinition & Document;

@Schema({ _id: false })
export class WorkflowLevelSub {
  @Prop({ required: true })
  levelOrder: number;

  @Prop({ required: true })
  levelName: string;

  @Prop({ required: true })
  approverRole: string;

  @Prop()
  approverId: string;

  @Prop({ default: 24 })
  escalationHours: number;
}

@Schema({ timestamps: true })
export class WorkflowDefinition {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  workflowType: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  makerCheckerEnabled: boolean;

  @Prop({ type: [WorkflowLevelSub], default: [] })
  levels: WorkflowLevelSub[];

  @Prop()
  deletedAt: Date;
}

export const WorkflowDefinitionSchema = SchemaFactory.createForClass(WorkflowDefinition);
