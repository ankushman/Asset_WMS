import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';

@ApiTags('Inbound & Outbound Workflows')
@Controller('api/v1/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get('inbound')
  @ApiOperation({ summary: 'Get all Inbound shipments with 9-step workflow pipelines' })
  async getInbound() {
    return this.workflowsService.getInboundShipments();
  }

  @Get('outbound')
  @ApiOperation({ summary: 'Get all Outbound orders with 7-step workflow pipelines' })
  async getOutbound() {
    return this.workflowsService.getOutboundOrders();
  }

  @Post('outbound/:id/gatepass/print')
  @ApiOperation({ summary: 'Record Gate Pass print audit log in database' })
  async recordGatePassPrint(@Param('id') id: string, @Body() body: { printedBy: string }) {
    return this.workflowsService.recordGatePassPrint(id, body.printedBy || 'Operations Supervisor');
  }
}
