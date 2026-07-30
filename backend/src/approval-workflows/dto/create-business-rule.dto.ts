import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessRuleDto {
  @ApiProperty({ example: 'comp-001' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'High Value PO Approval' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Requires Finance Approval for POs over $10,000' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'ORDER_VALUE' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'GREATER_THAN' })
  @IsString()
  operator: string;

  @ApiProperty({ example: '10000' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'PURCHASE_ORDER' })
  @IsString()
  workflowType: string;

  @ApiPropertyOptional({ example: 'FINANCE' })
  @IsOptional()
  @IsString()
  requiredApproverRole?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  additionalLevels?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  priority?: number;
}

export class UpdateBusinessRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requiredApproverRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  additionalLevels?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  priority?: number;
}
