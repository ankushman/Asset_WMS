import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShipmentDocument = Shipment & Document;

@Schema({ timestamps: true })
export class Shipment {
  @Prop({ required: true, unique: true })
  shipmentCode: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  originWarehouseId: string;

  @Prop()
  destinationAddress: string;

  @Prop()
  carrierName: string;

  @Prop()
  trackingNumber: string;

  @Prop({ default: 'IN_TRANSIT' })
  status: string;

  @Prop()
  dispatchedAt: Date;

  @Prop()
  deliveredAt: Date;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
