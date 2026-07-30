import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApprovalWorkflowsService } from './approval-workflows.service';
import { CreateWorkflowDefinitionDto, UpdateWorkflowDefinitionDto } from './dto/create-workflow-definition.dto';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { CreateBusinessRuleDto, UpdateBusinessRuleDto } from './dto/create-business-rule.dto';

@ApiTags('Approval Workflows & Business Rules Engine')
@Controller('api/v1/approval-workflows')
export class ApprovalWorkflowsController {
  constructor(private readonly service: ApprovalWorkflowsService) {}

  // ====================== WORKFLOW DEFINITIONS ======================

  @Get('definitions')
  @ApiOperation({ summary: 'Get all workflow definitions for a company' })
  @ApiQuery({ name: 'companyId', required: false })
  async getDefinitions(@Query('companyId') companyId: string) {
    return this.service.getWorkflowDefinitions(companyId || 'default');
  }

  @Post('definitions')
  @ApiOperation({ summary: 'Create a new workflow definition with approval levels' })
  async createDefinition(@Body() body: CreateWorkflowDefinitionDto) {
    return this.service.createWorkflowDefinition(body);
  }

  @Put('definitions/:id')
  @ApiOperation({ summary: 'Update a workflow definition' })
  async updateDefinition(@Param('id') id: string, @Body() body: UpdateWorkflowDefinitionDto) {
    return this.service.updateWorkflowDefinition(id, body);
  }

  @Delete('definitions/:id')
  @ApiOperation({ summary: 'Soft-delete a workflow definition' })
  async deleteDefinition(@Param('id') id: string) {
    return this.service.deleteWorkflowDefinition(id);
  }

  // ====================== APPROVAL REQUESTS ======================

  @Get('requests')
  @ApiOperation({ summary: 'Get approval requests with optional filters' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'workflowType', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'makerUserId', required: false })
  @ApiQuery({ name: 'approverId', required: false })
  async getRequests(
    @Query('companyId') companyId?: string,
    @Query('status') status?: string,
    @Query('workflowType') workflowType?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('makerUserId') makerUserId?: string,
    @Query('approverId') approverId?: string,
  ) {
    return this.service.getApprovalRequests({ companyId, status, workflowType, warehouseId, makerUserId, approverId });
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get approval request details with timeline' })
  async getRequestById(@Param('id') id: string) {
    return this.service.getApprovalRequestById(id);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Submit a new approval request' })
  async submitRequest(@Body() body: CreateApprovalRequestDto) {
    return this.service.submitApprovalRequest(body);
  }

  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Approve request at current level' })
  async approveRequest(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.approveRequest(id, body);
  }

  @Post('requests/:id/reject')
  @ApiOperation({ summary: 'Reject an approval request' })
  async rejectRequest(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.rejectRequest(id, body);
  }

  @Post('requests/:id/return')
  @ApiOperation({ summary: 'Return request for more information' })
  async returnRequest(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.returnRequest(id, body);
  }

  @Post('requests/:id/reassign')
  @ApiOperation({ summary: 'Reassign request to another approver' })
  async reassignRequest(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.reassignRequest(id, body);
  }

  @Post('requests/:id/cancel')
  @ApiOperation({ summary: 'Cancel an approval request (maker only)' })
  async cancelRequest(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.cancelRequest(id, body);
  }

  @Post('requests/:id/comment')
  @ApiOperation({ summary: 'Add a comment to an approval request' })
  async addComment(@Param('id') id: string, @Body() body: ApprovalActionDto) {
    return this.service.addComment(id, body);
  }

  @Get('requests/:id/timeline')
  @ApiOperation({ summary: 'Get the complete approval timeline' })
  async getTimeline(@Param('id') id: string) {
    return this.service.getTimeline(id);
  }

  // ====================== MY APPROVALS ======================

  @Get('my-approvals')
  @ApiOperation({ summary: 'Get requests pending my approval' })
  @ApiQuery({ name: 'userId', required: true })
  async getMyApprovals(@Query('userId') userId: string) {
    return this.service.getMyApprovals(userId);
  }

  // ====================== BUSINESS RULES ======================

  @Get('rules')
  @ApiOperation({ summary: 'Get all business rules for a company' })
  @ApiQuery({ name: 'companyId', required: false })
  async getRules(@Query('companyId') companyId: string) {
    return this.service.getBusinessRules(companyId || 'default');
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create a new business rule' })
  async createRule(@Body() body: CreateBusinessRuleDto) {
    return this.service.createBusinessRule(body);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update a business rule' })
  async updateRule(@Param('id') id: string, @Body() body: UpdateBusinessRuleDto) {
    return this.service.updateBusinessRule(id, body);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete a business rule' })
  async deleteRule(@Param('id') id: string) {
    return this.service.deleteBusinessRule(id);
  }

  @Post('rules/evaluate')
  @ApiOperation({ summary: 'Evaluate business rules against a context' })
  async evaluateRules(@Body() body: { companyId: string; workflowType: string; context: any }) {
    return this.service.evaluateRules(body.companyId, body.workflowType, body.context);
  }

  // ====================== NOTIFICATIONS ======================

  @Get('notifications')
  @ApiOperation({ summary: 'Get notifications for current user' })
  @ApiQuery({ name: 'userId', required: true })
  async getNotifications(@Query('userId') userId: string) {
    return this.service.getNotifications(userId);
  }

  @Post('notifications/:id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markNotificationRead(@Param('id') id: string) {
    return this.service.markNotificationRead(id);
  }

  @Post('notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllNotificationsRead(@Body() body: { userId: string }) {
    return this.service.markAllNotificationsRead(body.userId);
  }

  // ====================== DASHBOARD ======================

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get approval dashboard statistics' })
  @ApiQuery({ name: 'companyId', required: false })
  async getDashboardStats(@Query('companyId') companyId: string) {
    return this.service.getDashboardStats(companyId || 'default');
  }

  @Post('escalations/check')
  @ApiOperation({ summary: 'Check and process pending escalations' })
  async checkEscalations(@Body() body: { companyId: string }) {
    return this.service.checkEscalations(body.companyId);
  }
}
