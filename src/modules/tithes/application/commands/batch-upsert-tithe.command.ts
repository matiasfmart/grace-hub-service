import { IsNumber, IsBoolean } from 'class-validator';

/**
 * DTO for batch tithe update
 * Represents a single tithe status change
 */
export class TitheBatchItemDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsBoolean()
  didTithe: boolean;
}
