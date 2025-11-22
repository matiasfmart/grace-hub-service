import { IsNumber, Min, Max } from 'class-validator';

export class CreateTitheDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
}
