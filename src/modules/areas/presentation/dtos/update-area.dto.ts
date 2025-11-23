import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
