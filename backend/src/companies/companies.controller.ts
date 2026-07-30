import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';

@ApiTags('Company Workspace Management')
@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get isolated company workspace profile details' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company workspace profile (GST, Address, Logo, Contact)' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.companiesService.update(id, body);
  }
}
