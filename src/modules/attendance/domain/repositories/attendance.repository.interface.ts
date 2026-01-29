import { Attendance } from '../attendance.aggregate';

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
}

export const ATTENDANCE_REPOSITORY = Symbol('ATTENDANCE_REPOSITORY');
