import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ default: 'VIEWER', index: true })
  role: string;

  @Prop({ default: 'ACTIVE', index: true })
  accountStatus: string;

  @Prop({ index: true })
  companyId: string;

  @Prop({ index: true })
  warehouseId: string;

  @Prop()
  warehouseName: string;

  @Prop()
  department: string;

  @Prop()
  designation: string;

  @Prop()
  jobTitle: string;

  @Prop()
  employeeIdCode: string;

  @Prop()
  emergencyContact: string;

  @Prop()
  avatar: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop()
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ companyId: 1, email: 1 });
UserSchema.index({ companyId: 1, role: 1 });
