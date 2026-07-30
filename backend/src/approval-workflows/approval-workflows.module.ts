import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovalWorkflowsController } from './approval-workflows.controller';
import { ApprovalWorkflowsService } from './approval-workflows.service';
import { WorkflowDefinition, WorkflowDefinitionSchema } from '../schemas/workflow-definition.schema';
import { ApprovalRequestV2, ApprovalRequestV2Schema } from '../schemas/approval-request.schema';
import { BusinessRule, BusinessRuleSchema } from '../schemas/business-rule.schema';
import { WorkflowNotification, WorkflowNotificationSchema } from '../schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkflowDefinition.name, schema: WorkflowDefinitionSchema },
      { name: ApprovalRequestV2.name, schema: ApprovalRequestV2Schema },
      { name: BusinessRule.name, schema: BusinessRuleSchema },
      { name: WorkflowNotification.name, schema: WorkflowNotificationSchema },
    ]),
  ],
  controllers: [ApprovalWorkflowsController],
  providers: [ApprovalWorkflowsService],
  exports: [ApprovalWorkflowsService],
})
export class ApprovalWorkflowsModule {}
