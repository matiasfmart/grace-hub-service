import { IsString, IsOptional, MaxLength, IsInt, IsPositive } from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  leaderId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  mentorId?: number;
}
