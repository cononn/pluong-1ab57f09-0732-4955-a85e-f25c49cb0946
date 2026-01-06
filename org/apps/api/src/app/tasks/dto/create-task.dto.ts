import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['Open', 'In Progress', 'On-Hold', 'Completed'])
  status: string;

  @IsUUID()
  organizationId: string; // You will provide the organization ID
}
