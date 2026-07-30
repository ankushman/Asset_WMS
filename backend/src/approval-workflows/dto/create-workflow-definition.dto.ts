import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkflowLevelDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  levelOrder: number;

  @ApiProperty({ example: 'Warehouse Manager Approval' })
  @IsString()
  levelName: string;

  @ApiProperty({ example: 'WAREHOUSE_MANAGER' })
  @IsString()
  approverRole: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approverId?: string;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsInt()
  escalationHours?: number;
}

export class CreateWorkflowDefinitionDto {
  @ApiProperty({ example: 'comp-001' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'PURCHASE_ORDER' })
  @IsString()
  workflowType: string;

  @ApiProperty({ example: 'Purchase Order Approval' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  makerCheckerEnabled?: boolean;

  @ApiProperty({ type: [CreateWorkflowLevelDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkflowLevelDto)
  levels: CreateWorkflowLevelDto[];
}

export class UpdateWorkflowDefinitionDto {
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
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  makerCheckerEnabled?: boolean;

  @ApiPropertyOptional({ type: [CreateWorkflowLevelDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkflowLevelDto)
  levels?: CreateWorkflowLevelDto[];
}
