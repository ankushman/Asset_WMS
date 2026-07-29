import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiTags('Asset Management')
@Controller('api/v1/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered enterprise assets' })
  async findAll() {
    return this.assetsService.findAll();
  }

  @Get('next-id')
  @ApiOperation({ summary: 'Get next auto-generated per-category Asset ID (AST-{CODE}-{SEQ})' })
  async getNextId(@Query('category') category: string) {
    return this.assetsService.getNextId(category || 'Forklift');
  }

  @Post()
  @ApiOperation({ summary: 'Register a new enterprise asset master' })
  async create(@Body() body: any) {
    return this.assetsService.create(body);
  }
}
