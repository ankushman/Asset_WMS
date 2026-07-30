import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessRuleDocument = BusinessRule & Document;

@Schema({ timestamps: true })
export class BusinessRule {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  operator: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  workflowType: string;

  @Prop()
  requiredApproverRole: string;

  @Prop({ default: 0 })
  additionalLevels: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priority: number;
}

export const BusinessRuleSchema = SchemaFactory.createForClass(BusinessRule);
