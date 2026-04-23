import { IsOptional, IsString, IsInt, Min, Max, IsArray, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO for member filter query parameters
 * Presentation Layer - validates and transforms HTTP query params
 */
export class GetMembersFilteredDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    return value;
  })
  status?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    return value;
  })
  role?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    return value;
  })
  gdi?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    return value;
  })
  area?: string[];

  /** Filter by church join date — lower bound (ISO YYYY-MM-DD) */
  @IsOptional()
  @IsDateString()
  joinFrom?: string;

  /** Filter by church join date — upper bound (ISO YYYY-MM-DD) */
  @IsOptional()
  @IsDateString()
  joinTo?: string;

  /** Filter by minimum age (inclusive, based on birth_date) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ageMin?: number;

  /** Filter by maximum age (inclusive, based on birth_date) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ageMax?: number;

  /** Sort field */
  @IsOptional()
  @IsString()
  sortBy?: string;

  /** Sort direction */
  @IsOptional()
  @IsString()
  sortOrder?: string;

  /** Filter by ecclesiastical label IDs (comma-separated). OR semantics. */
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number).filter(n => !isNaN(n));
    }
    if (Array.isArray(value)) {
      return value.map(Number).filter(n => !isNaN(n));
    }
    return value;
  })
  label?: number[];
}
