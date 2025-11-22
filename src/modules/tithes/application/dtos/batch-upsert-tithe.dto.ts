import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTitheDto } from './create-tithe.dto';

export class BatchUpsertTitheDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTitheDto)
  tithes: CreateTitheDto[];
}
