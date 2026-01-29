import { IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Single item in a batch tithe update
 */
export class BatchTitheItemDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsBoolean()
  didTithe: boolean;
}

/**
 * DTO for batch tithe updates
 */
export class BatchUpsertTithesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchTitheItemDto)
  items: BatchTitheItemDto[];
}
