import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';

@ApiTags('Roles & Permissions Management')
@Controller('api/v1/roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('role.view')
  @ApiOperation({ summary: 'Get list of enterprise roles & custom company roles' })
  async findAll(@Query('companyId') companyId?: string) {
    return this.rolesService.findAll(companyId);
  }

  @Post()
  @RequirePermissions('role.create')
  @ApiOperation({ summary: 'Create new custom role with granular permissions' })
  async create(@Body() body: any) {
    return this.rolesService.create(body);
  }

  @Patch(':id')
  @RequirePermissions('role.edit')
  @ApiOperation({ summary: 'Update role metadata or permission mappings' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.rolesService.update(id, body);
  }

  @Post(':id/duplicate')
  @RequirePermissions('role.create')
  @ApiOperation({ summary: 'Duplicate existing role' })
  async duplicate(@Param('id') id: string) {
    return this.rolesService.duplicate(id);
  }

  @Delete(':id')
  @RequirePermissions('role.delete')
  @ApiOperation({ summary: 'Delete custom role' })
  async delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
