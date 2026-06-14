import { Prospect } from '../../domain/prospect.aggregate';

export class ProspectResponseDto {
  prospectId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  contact?: string;
  source: string;
  addedBy?: number;
  addedByName?: string;
  visitDate: string; // ISO 8601 datetime — field name kept for API backward compatibility
  meetingSeriesId?: number;
  meetingSeriesName?: string;
  notes?: string;
  status: string;
  memberId?: number;
  createdAt: string;
  updatedAt: string;

  static fromDomain(prospect: Prospect): ProspectResponseDto {
    const dto = new ProspectResponseDto();
    dto.prospectId = prospect.id!;
    dto.firstName = prospect.firstName;
    dto.lastName = prospect.lastName;
    dto.fullName = prospect.fullName;
    dto.contact = prospect.contact;
    dto.source = prospect.source;
    dto.addedBy = prospect.addedBy;
    dto.addedByName = prospect.addedByName;
    // Send full ISO datetime — no truncation. Clients use this to display hour.
    dto.visitDate = prospect.visitAt instanceof Date
      ? prospect.visitAt.toISOString()
      : String(prospect.visitAt);
    dto.meetingSeriesId = prospect.meetingSeriesId;
    dto.meetingSeriesName = prospect.meetingSeriesName;
    dto.notes = prospect.notes;
    dto.status = prospect.status;
    dto.memberId = prospect.memberId;
    dto.createdAt = prospect.createdAt.toISOString();
    dto.updatedAt = prospect.updatedAt.toISOString();
    return dto;
  }
}

export class PendingCountResponseDto {
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}
