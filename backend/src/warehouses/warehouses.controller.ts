import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';

@ApiTags('Warehouses & Profile')
@Controller('api/v1/warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active warehouses' })
  async findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get 11-tab warehouse profile details' })
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse facility' })
  async create(@Body() body: any) {
    return this.warehousesService.create(body);
  }
}
