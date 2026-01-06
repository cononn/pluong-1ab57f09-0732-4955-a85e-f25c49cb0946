import { IsString, IsOptional, IsEnum, IsIn, IsUUID } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
   @IsIn(['Open', 'In Progress', 'On-Hold', 'Completed'])
  status?: string;

  @IsUUID()
  organizationId: string;
}
