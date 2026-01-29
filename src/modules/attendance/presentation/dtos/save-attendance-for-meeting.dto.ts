import { IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Single item for saving attendance
 */
export class AttendanceItemDto {
  @IsNumber()
  memberId: number;

  @IsBoolean()
  wasPresent: boolean;
}

/**
 * DTO for saving attendance for a meeting
 */
export class SaveAttendanceForMeetingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  attendances: AttendanceItemDto[];
}
