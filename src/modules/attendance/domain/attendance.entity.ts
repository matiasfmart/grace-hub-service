export class Attendance {
  attendanceId: number;
  meetingId: number;
  memberId: number;
  wasPresent: boolean;
  wasActive: boolean;
  snapshotRoleGeneral?: string;
  snapshotRoleSpecific?: string;
  snapshotGdiId?: number;
  snapshotAreaId?: number;
  createdAt: Date;
  updatedAt: Date;
}
