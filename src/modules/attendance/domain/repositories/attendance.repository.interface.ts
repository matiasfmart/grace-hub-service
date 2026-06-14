import { Attendance } from '../attendance.aggregate';

/**
 * Read model for aggregated attendance stats per meeting.
 * Used by GET /attendance/stats — avoids fetching all rows.
 */
export interface AttendanceMeetingStats {
  meetingId: number;
  presentCount: number;
  absentCount: number;
  totalExpected: number;
}

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<Attendance>;
  saveMany(attendances: Attendance[]): Promise<Attendance[]>;
  findById(id: number): Promise<Attendance | null>;
  findAll(): Promise<Attendance[]>;
  findByMeeting(meetingId: number): Promise<Attendance[]>;
  findByMember(memberId: number): Promise<Attendance[]>;
  findByMeetingAndMember(meetingId: number, memberId: number): Promise<Attendance | null>;
  delete(id: number): Promise<void>;
  deleteByMeeting(meetingId: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  findStatsByMeetings(meetingIds: number[]): Promise<AttendanceMeetingStats[]>;
}

export const ATTENDANCE_REPOSITORY = Symbol('ATTENDANCE_REPOSITORY');
