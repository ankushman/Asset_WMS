import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransportationTripDocument = TransportationTrip & Document;

@Schema({ timestamps: true })
export class TransportationTrip {
  @Prop({ required: true, unique: true })
  tripCode: string;

  @Prop({ required: true })
  companyId: string;

  @Prop()
  vehicleNumber: string;

  @Prop()
  driverName: string;

  @Prop()
  driverPhone: string;

  @Prop()
  origin: string;

  @Prop()
  destination: string;

  @Prop({ default: 'SCHEDULED' })
  status: string;

  @Prop()
  estimatedArrival: Date;
}

export const TransportationTripSchema = SchemaFactory.createForClass(TransportationTrip);
