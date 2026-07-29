import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { AssetsModule } from './assets/assets.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [AuthModule, WarehousesModule, AssetsModule, WorkflowsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
