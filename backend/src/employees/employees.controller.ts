import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';

@ApiTags('Employee Roster & Invitation Management')
@Controller('api/v1/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get company employee roster filtered by isolated Company ID' })
  async findAll(@Query('companyId') companyId?: string) {
    return this.employeesService.findAll(companyId);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite new employee and generate secure activation token' })
  async invite(@Body() body: any) {
    return this.employeesService.invite(body);
  }

  @Post('activate/:token')
  @ApiOperation({ summary: 'Activate invited employee account and set permanent password' })
  async activate(@Param('token') token: string, @Body() body: any) {
    return this.employeesService.activate(token, body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update employee account status (ACTIVE, SUSPENDED, DEACTIVATED)' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.employeesService.updateStatus(id, body.status);
  }
}
