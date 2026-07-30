import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApprovalActionDto {
  @ApiProperty({ example: 'usr-001' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Deepak Sangkaj' })
  @IsString()
  userName: string;

  @ApiProperty({ example: 'SUPER_ADMIN' })
  @IsString()
  userRole: string;

  @ApiPropertyOptional({ example: 'Approved after finance review.' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ example: 'usr-002', description: 'Target user ID for reassignment' })
  @IsOptional()
  @IsString()
  reassignToUserId?: string;

  @ApiPropertyOptional({ example: 'Priya Sundaram' })
  @IsOptional()
  @IsString()
  reassignToUserName?: string;
}
