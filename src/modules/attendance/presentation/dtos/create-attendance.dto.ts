import { IsNumber, IsBoolean } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  meetingId: number;

  @IsNumber()
  memberId: number;

  @IsBoolean()
  wasPresent: boolean;
}
