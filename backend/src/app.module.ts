import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { AssetsModule } from './assets/assets.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { RolesModule } from './roles/roles.module';
import { ApprovalWorkflowsModule } from './approval-workflows/approval-workflows.module';

const logger = new Logger('MongoDBConnection');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/asset_wms';
        const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
        logger.log(`[MongoDB Atlas] Initializing connection to URI: ${maskedUri}`);
        return {
          uri,
          connectionFactory: (connection) => {
            logger.log(`[MongoDB Atlas] Connecting to database: ${connection.name || 'ennea_wms'}...`);
            connection.on('connected', () => {
              logger.log('[MongoDB Atlas] Successfully connected to MongoDB Database.');
            });
            connection.on('error', (err) => {
              logger.error(`[MongoDB Atlas] Connection Error: ${err.message}`);
            });
            return connection;
          },
        };
      },
    }),
    AuthModule,
    WarehousesModule,
    AssetsModule,
    WorkflowsModule,
    CompaniesModule,
    EmployeesModule,
    RolesModule,
    ApprovalWorkflowsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
