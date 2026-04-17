import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IExpectedAttendeesQueryService,
  ExpectedAttendee,
} from '../../domain/services/expected-attendees.query-service.interface';
import { AudienceType } from '../../../../core/common/constants/status.constants';
import { MemberEntity } from '../../../members/infrastructure/persistence/typeorm/member.typeorm.entity';

/**
 * TypeORM Implementation of Expected Attendees Query Service
 * 
 * Handles cross-module queries to determine who should attend a meeting
 * based on the meeting series' audienceType.
 */
@Injectable()
export class ExpectedAttendeesQueryServiceImpl implements IExpectedAttendeesQueryService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async getExpectedAttendees(
    audienceType: AudienceType,
    gdiId: number | null,
    areaId: number | null,
    meetingTypeId: number | null,
  ): Promise<ExpectedAttendee[]> {
    switch (audienceType) {
      case AudienceType.GDI:
        return this.getMembersByGdi(gdiId);
      case AudienceType.AREA:
        return this.getMembersByArea(areaId);
      case AudienceType.ALL_ACTIVE:
        return this.getAllActiveMembers();
      case AudienceType.BY_CATEGORIES:
        return this.getMembersByCategories(meetingTypeId);
      default:
        return [];
    }
  }

  private async getMembersByGdi(gdiId: number | null): Promise<ExpectedAttendee[]> {
    if (!gdiId) return [];

    const members = await this.memberRepository
      .createQueryBuilder('m')
      .innerJoin('gdi_memberships', 'gm', 'gm.member_id = m.member_id')
      .where('gm.gdi_id = :gdiId', { gdiId })
      .andWhere('m.record_status = :recordStatus', { recordStatus: 'vigente' })
      .select([
        'm.member_id AS "memberId"',
        'm.first_name AS "firstName"',
        'm.last_name AS "lastName"',
      ])
      .getRawMany();

    return members.map(m => ({
      memberId: m.memberId,
      firstName: m.firstName,
      lastName: m.lastName,
      fullName: `${m.firstName} ${m.lastName}`,
    }));
  }

  private async getMembersByArea(areaId: number | null): Promise<ExpectedAttendee[]> {
    if (!areaId) return [];

    const members = await this.memberRepository
      .createQueryBuilder('m')
      .innerJoin('area_memberships', 'am', 'am.member_id = m.member_id')
      .where('am.area_id = :areaId', { areaId })
      .andWhere('m.record_status = :recordStatus', { recordStatus: 'vigente' })
      .select([
        'm.member_id AS "memberId"',
        'm.first_name AS "firstName"',
        'm.last_name AS "lastName"',
      ])
      .getRawMany();

    return members.map(m => ({
      memberId: m.memberId,
      firstName: m.firstName,
      lastName: m.lastName,
      fullName: `${m.firstName} ${m.lastName}`,
    }));
  }

  private async getAllActiveMembers(): Promise<ExpectedAttendee[]> {
    const members = await this.memberRepository
      .createQueryBuilder('m')
      .where('m.record_status = :recordStatus', { recordStatus: 'vigente' })
      .select([
        'm.member_id AS "memberId"',
        'm.first_name AS "firstName"',
        'm.last_name AS "lastName"',
      ])
      .getRawMany();

    return members.map(m => ({
      memberId: m.memberId,
      firstName: m.firstName,
      lastName: m.lastName,
      fullName: `${m.firstName} ${m.lastName}`,
    }));
  }

  private async getMembersByCategories(meetingTypeId: number | null): Promise<ExpectedAttendee[]> {
    if (!meetingTypeId) return [];

    // Query members based on meeting_type_categories configuration
    // This joins meeting_type -> meeting_type_categories -> attendee_categories -> members
    const members = await this.memberRepository
      .createQueryBuilder('m')
      .innerJoin('attendee_categories', 'ac', 'ac.member_id = m.member_id')
      .innerJoin('meeting_type_categories', 'mtc', 'mtc.category_id = ac.category_id')
      .where('mtc.meeting_type_id = :meetingTypeId', { meetingTypeId })
      .andWhere('m.record_status = :recordStatus', { recordStatus: 'vigente' })
      .select([
        'm.member_id AS "memberId"',
        'm.first_name AS "firstName"',
        'm.last_name AS "lastName"',
      ])
      .distinct(true)
      .getRawMany();

    return members.map(m => ({
      memberId: m.memberId,
      firstName: m.firstName,
      lastName: m.lastName,
      fullName: `${m.firstName} ${m.lastName}`,
    }));
  }
}
