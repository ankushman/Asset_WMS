import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GatePassDocument = GatePass & Document;

@Schema({ timestamps: true })
export class GatePass {
  @Prop({ required: true, unique: true })
  passNumber: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  warehouseId: string;

  @Prop()
  vehicleNumber: string;

  @Prop()
  visitorName: string;

  @Prop()
  purpose: string;

  @Prop({ default: 'ISSUED' })
  status: string;

  @Prop()
  issuedAt: Date;

  @Prop()
  validUntil: Date;
}

export const GatePassSchema = SchemaFactory.createForClass(GatePass);
