import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  logo: string;

  @Prop()
  industry: string;

  @Prop()
  gstNumber: string;

  @Prop()
  panNumber: string;

  @Prop()
  cinNumber: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  website: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ default: 'ENTERPRISE' })
  subscription: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
