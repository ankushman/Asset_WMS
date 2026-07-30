import { IsString, IsOptional, IsEnum, IsNumber, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApprovalRequestDto {
  @ApiProperty({ example: 'comp-001' })
  @IsString()
  companyId: string;

  @ApiPropertyOptional({ example: 'wh-001' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'Mumbai Central Mega Hub' })
  @IsOptional()
  @IsString()
  warehouseName?: string;

  @ApiProperty({ example: 'PURCHASE_ORDER' })
  @IsString()
  workflowType: string;

  @ApiProperty({ example: 'Procure 10 Zebra TC52 Scanners' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Required for Q3 volume surge' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Assets' })
  @IsString()
  module: string;

  @ApiPropertyOptional({ description: 'JSON stringified request payload' })
  @IsOptional()
  @IsString()
  requestData?: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: 'usr-001' })
  @IsString()
  makerUserId: string;

  @ApiProperty({ example: 'Rajesh Sharma' })
  @IsString()
  makerUserName: string;
}
