import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleRecord, RoleRecordSchema } from '../schemas/role.schema';
import { PermissionRecord, PermissionRecordSchema } from '../schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleRecord.name, schema: RoleRecordSchema },
      { name: PermissionRecord.name, schema: PermissionRecordSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
