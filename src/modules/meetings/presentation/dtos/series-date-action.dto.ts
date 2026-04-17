import { IsDateString, IsNotEmpty } from 'class-validator';

export class SeriesDateActionDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
