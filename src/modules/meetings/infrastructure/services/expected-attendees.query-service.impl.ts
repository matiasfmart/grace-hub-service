import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IExpectedAttendeesQueryService,
  ExpectedAttendee,
  AudienceConfig,
} from '../../domain/services/expected-attendees.query-service.interface';
import { AudienceType } from '../../../../core/common/constants/status.constants';
import { MemberEntity } from '../../../members/infrastructure/persistence/typeorm/member.typeorm.entity';

/**
 * TypeORM Implementation of Expected Attendees Query Service
 * 
 * Handles cross-module queries to determine who should attend a meeting
 * based on the meeting series' audienceType.
 * 
 * Implements ADR-004 (Clasificación de Miembros) and ADR-005 (Tipos de Audiencia):
 * - By Group: gdi, area
 * - By Operative Level: all_active, integrated, workers, leaders, mentors
 * - By Ecclesiastical Labels: by_categories (using role_types)
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
    audienceConfig: AudienceConfig | null,
  ): Promise<ExpectedAttendee[]> {
    switch (audienceType) {
      // Por grupo específico
      case AudienceType.GDI:
        return this.getMembersByGdi(gdiId);
      case AudienceType.AREA:
        return this.getMembersByArea(areaId);
      
      // Por nivel operativo (ADR-004)
      case AudienceType.ALL_ACTIVE:
        return this.getAllActiveMembers();
      case AudienceType.INTEGRATED:
        return this.getMembersByOperativeLevel(1);
      case AudienceType.WORKERS:
        return this.getMembersByOperativeLevel(2);
      case AudienceType.LEADERS:
        return this.getMembersByOperativeLevel(3);
      case AudienceType.MENTORS:
        return this.getMembersByOperativeLevel(4);
      
      // Por etiquetas eclesiásticas (ADR-003)
      case AudienceType.BY_CATEGORIES:
        return this.getMembersByRoleTypes(audienceConfig);
      
      default:
        return [];
    }
  }

  /**
   * Get members of a specific GDI (includes guide)
   */
  private async getMembersByGdi(gdiId: number | null): Promise<ExpectedAttendee[]> {
    if (!gdiId) return [];

    // Get GDI members + guide
    const members = await this.memberRepository.query(`
      SELECT DISTINCT m.member_id AS "memberId", m.first_name AS "firstName", m.last_name AS "lastName"
      FROM members m
      WHERE m.record_status = 'vigente'
      AND (
        m.member_id IN (SELECT member_id FROM gdi_memberships WHERE gdi_id = $1)
        OR m.member_id = (SELECT guide_id FROM gdis WHERE gdi_id = $1)
      )
    `, [gdiId]);

    return this.mapToExpectedAttendees(members);
  }

  /**
   * Get members of a specific Area (includes leader)
   */
  private async getMembersByArea(areaId: number | null): Promise<ExpectedAttendee[]> {
    if (!areaId) return [];

    // Get Area members + leader
    const members = await this.memberRepository.query(`
      SELECT DISTINCT m.member_id AS "memberId", m.first_name AS "firstName", m.last_name AS "lastName"
      FROM members m
      WHERE m.record_status = 'vigente'
      AND (
        m.member_id IN (SELECT member_id FROM area_memberships WHERE area_id = $1)
        OR m.member_id = (SELECT leader_id FROM areas WHERE area_id = $1)
      )
    `, [areaId]);

    return this.mapToExpectedAttendees(members);
  }

  /**
   * Get all active (vigente) members
   */
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

    return this.mapToExpectedAttendees(members);
  }

  /**
   * Get members by operative level (ADR-004)
   * 
   * Levels:
   * - 4: Mentor (mentor of GDI or Area)
   * - 3: Leader (guide of GDI or leader of Area)
   * - 2: Worker (area member)
   * - 1: Integrated (GDI member)
   * - 0: Not integrated
   * 
   * @param minLevel - Minimum operative level required (uses >= comparison)
   */
  private async getMembersByOperativeLevel(minLevel: number): Promise<ExpectedAttendee[]> {
    // Query based on ADR-004 definition
    const members = await this.memberRepository.query(`
      SELECT DISTINCT m.member_id AS "memberId", m.first_name AS "firstName", m.last_name AS "lastName"
      FROM members m
      WHERE m.record_status = 'vigente'
      AND (
        CASE
          -- Level 4: Mentor
          WHEN EXISTS(SELECT 1 FROM gdis g WHERE g.mentor_id = m.member_id)
               OR EXISTS(SELECT 1 FROM areas a WHERE a.mentor_id = m.member_id)
          THEN 4
          
          -- Level 3: Leader (Guide or Area Leader)
          WHEN EXISTS(SELECT 1 FROM gdis g WHERE g.guide_id = m.member_id)
               OR EXISTS(SELECT 1 FROM areas a WHERE a.leader_id = m.member_id)
          THEN 3
          
          -- Level 2: Worker (Area member)
          WHEN EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id)
          THEN 2
          
          -- Level 1: Integrated (GDI member)
          WHEN EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id)
          THEN 1
          
          -- Level 0: Not integrated
          ELSE 0
        END
      ) >= $1
    `, [minLevel]);

    return this.mapToExpectedAttendees(members);
  }

  /**
   * Get members by ecclesiastical labels (ADR-003)
   * Uses role_types table configured by administrators
   * 
   * @param audienceConfig - Configuration with roleTypeIds or labels
   */
  private async getMembersByRoleTypes(audienceConfig: AudienceConfig | null): Promise<ExpectedAttendee[]> {
    if (!audienceConfig) return [];

    const { roleTypeIds, labels, combineMode = 'OR' } = audienceConfig;

    // If neither roleTypeIds nor labels are provided, return empty
    if ((!roleTypeIds || roleTypeIds.length === 0) && (!labels || labels.length === 0)) {
      return [];
    }

    // Build the query based on the configuration
    let query = `
      SELECT DISTINCT m.member_id AS "memberId", m.first_name AS "firstName", m.last_name AS "lastName"
      FROM members m
      INNER JOIN member_roles mr ON mr.member_id = m.member_id
      INNER JOIN role_types rt ON rt.role_type_id = mr.role_type_id
      WHERE m.record_status = 'vigente'
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (roleTypeIds && roleTypeIds.length > 0) {
      conditions.push(`mr.role_type_id = ANY($${paramIndex})`);
      params.push(roleTypeIds);
      paramIndex++;
    }

    if (labels && labels.length > 0) {
      conditions.push(`rt.name = ANY($${paramIndex})`);
      params.push(labels);
      paramIndex++;
    }

    if (conditions.length > 0) {
      const operator = combineMode === 'AND' ? ' AND ' : ' OR ';
      query += ` AND (${conditions.join(operator)})`;
    }

    const members = await this.memberRepository.query(query, params);
    return this.mapToExpectedAttendees(members);
  }

  /**
   * Helper to map raw query results to ExpectedAttendee objects
   */
  private mapToExpectedAttendees(rawMembers: any[]): ExpectedAttendee[] {
    return rawMembers.map(m => ({
      memberId: m.memberId,
      firstName: m.firstName,
      lastName: m.lastName,
      fullName: `${m.firstName} ${m.lastName}`,
    }));
  }
}
