import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberEntity } from './member.typeorm.entity';
import { IMemberRepository } from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';
import {
  MemberWithAssignmentsReadModel,
  MemberRoleType,
  GdiAssignment,
  AreaAssignment,
  EcclesiasticalRole,
} from '../../../domain/read-models/member-with-assignments.read-model';
import {
  MemberFilterOptions,
  PaginatedMembersResult,
} from '../../../domain/read-models/member-query.types';
import { MemberStatus, RecordStatus } from '../../../../../core/common/constants/status.constants';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { MemberMapper } from './mappers/member.mapper';

/**
 * Raw result from the enriched query
 */
interface MemberWithAssignmentsRaw {
  member_id: number;
  first_name: string;
  last_name: string;
  contact: string | null;
  record_status: string;
  birth_date: Date | null;
  baptism_date: Date | null;
  join_date: Date | null;
  bible_study: boolean;
  type_bible_study: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
  // GDI assignment
  gdi_id: number | null;
  gdi_name: string | null;
  // Area assignments (arrays)
  area_ids: number[] | null;
  area_names: string[] | null;
  // Ecclesiastical roles (arrays from member_roles)
  ecclesiastical_role_type_ids: number[] | null;
  ecclesiastical_role_names: string[] | null;
  // Role indicators (booleans from CTE)
  is_gdi_guide: boolean;
  is_gdi_mentor: boolean;
  is_area_leader: boolean;
  is_area_mentor: boolean;
}

/**
 * Base query for member with assignments
 * Uses subqueries for areas to avoid row multiplication
 * No GROUP BY needed since we use scalar subqueries for arrays
 * GDI is fetched via subquery to avoid duplication if member is in multiple GDIs
 */
const MEMBER_WITH_ASSIGNMENTS_QUERY = `
  SELECT 
    m.member_id,
    m.first_name,
    m.last_name,
    m.contact,
    m.record_status,
    m.birth_date,
    m.baptism_date,
    m.join_date,
    m.bible_study,
    m.type_bible_study,
    m.address,
    m.created_at,
    m.updated_at,
    -- GDI membership (using subquery to get first GDI and avoid duplication)
    (SELECT g.gdi_id 
     FROM gdi_memberships gm 
     JOIN gdis g ON gm.gdi_id = g.gdi_id 
     WHERE gm.member_id = m.member_id 
     LIMIT 1) as gdi_id,
    (SELECT g.name 
     FROM gdi_memberships gm 
     JOIN gdis g ON gm.gdi_id = g.gdi_id 
     WHERE gm.member_id = m.member_id 
     LIMIT 1) as gdi_name,
    -- Area memberships (aggregated into arrays via subquery)
    COALESCE(
      (SELECT ARRAY_AGG(ar.area_id ORDER BY ar.area_id) 
       FROM area_memberships am2 
       JOIN areas ar ON am2.area_id = ar.area_id 
       WHERE am2.member_id = m.member_id),
      ARRAY[]::integer[]
    ) as area_ids,
    COALESCE(
      (SELECT ARRAY_AGG(ar.name ORDER BY ar.area_id) 
       FROM area_memberships am2 
       JOIN areas ar ON am2.area_id = ar.area_id 
       WHERE am2.member_id = m.member_id),
      ARRAY[]::varchar[]
    ) as area_names,
    -- Role detection via EXISTS (efficient with indexes)
    EXISTS(SELECT 1 FROM gdis WHERE guide_id = m.member_id) as is_gdi_guide,
    EXISTS(SELECT 1 FROM gdis WHERE mentor_id = m.member_id) as is_gdi_mentor,
    EXISTS(SELECT 1 FROM areas WHERE leader_id = m.member_id) as is_area_leader,
    EXISTS(SELECT 1 FROM areas WHERE mentor_id = m.member_id) as is_area_mentor,
    -- Ecclesiastical labels from member_roles
    COALESCE(
      (SELECT ARRAY_AGG(rt.role_type_id ORDER BY rt.name)
       FROM member_roles mr
       JOIN role_types rt ON mr.role_type_id = rt.role_type_id
       WHERE mr.member_id = m.member_id),
      ARRAY[]::integer[]
    ) as ecclesiastical_role_type_ids,
    COALESCE(
      (SELECT ARRAY_AGG(rt.name ORDER BY rt.name)
       FROM member_roles mr
       JOIN role_types rt ON mr.role_type_id = rt.role_type_id
       WHERE mr.member_id = m.member_id),
      ARRAY[]::varchar[]
    ) as ecclesiastical_role_names
  FROM members m
`;

/**
 * TypeORM Implementation of IMemberRepository
 * This class belongs to the Infrastructure layer
 */
@Injectable()
export class MemberRepositoryImpl
  extends BaseRepository<MemberEntity>
  implements IMemberRepository
{
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    dataSource: DataSource,
  ) {
    super(memberRepository, dataSource);
  }

  // ==========================================
  // COMMAND OPERATIONS (use Aggregate)
  // ==========================================

  async save(member: Member): Promise<Member> {
    const entity = MemberMapper.toPersistence(member);
    const savedEntity = await this.memberRepository.save(entity);
    return MemberMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Member | null> {
    const entity = await this.memberRepository.findOne({
      where: { memberId: id },
    });
    return entity ? MemberMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Member[]> {
    const entities = await this.memberRepository.find();
    return MemberMapper.toDomainArray(entities);
  }

  async findByRecordStatus(recordStatus: RecordStatus): Promise<Member[]> {
    const entities = await this.memberRepository.find({
      where: { recordStatus: recordStatus },
    });
    return MemberMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.memberRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.memberRepository.count({
      where: { memberId: id },
    });
    return count > 0;
  }

  // ==========================================
  // QUERY OPERATIONS (use Read Model)
  // ==========================================

  /**
   * Find all members with enriched GDI, Areas, and Roles data
   */
  async findAllWithAssignments(): Promise<MemberWithAssignmentsReadModel[]> {
    const query = `
      ${MEMBER_WITH_ASSIGNMENTS_QUERY}
      ORDER BY m.first_name, m.last_name
    `;

    const rawResults: MemberWithAssignmentsRaw[] =
      await this.memberRepository.query(query);

    return rawResults.map((raw) => this.mapRawToReadModel(raw));
  }

  /**
   * Find a member by ID with enriched data
   */
  async findByIdWithAssignments(id: number): Promise<MemberWithAssignmentsReadModel | null> {
    const query = `
      ${MEMBER_WITH_ASSIGNMENTS_QUERY}
      WHERE m.member_id = $1
    `;

    const rawResults: MemberWithAssignmentsRaw[] =
      await this.memberRepository.query(query, [id]);

    if (rawResults.length === 0) {
      return null;
    }

    return this.mapRawToReadModel(rawResults[0]);
  }

  /**
   * Find members with filters, search, and pagination
   * Server-side filtering for scalability
   */
  async findAllWithAssignmentsFiltered(
    options: MemberFilterOptions
  ): Promise<PaginatedMembersResult<MemberWithAssignmentsReadModel>> {
    const { conditions, params } = this.buildFilterConditions(options);
    
    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM members m
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    
    const countResult = await this.memberRepository.query(countQuery, params);
    const totalCount = parseInt(countResult[0]?.total || '0', 10);
    
    // Data query with pagination
    const dataQuery = `
      ${MEMBER_WITH_ASSIGNMENTS_QUERY}
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
      ORDER BY m.first_name, m.last_name
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const rawResults: MemberWithAssignmentsRaw[] = await this.memberRepository.query(
      dataQuery,
      [...params, options.pageSize, options.offset]
    );
    
    const data = rawResults.map((raw) => this.mapRawToReadModel(raw));
    
    return {
      data,
      totalCount,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(totalCount / options.pageSize),
    };
  }

  /**
   * Build SQL filter conditions from options
   */
  private buildFilterConditions(options: MemberFilterOptions): {
    conditions: string[];
    params: any[];
  } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Search filter (name, contact)
    if (options.searchTerm && options.searchTerm.trim() !== '') {
      const searchPattern = `%${options.searchTerm.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(m.first_name || ' ' || m.last_name) LIKE $${paramIndex}
        OR LOWER(m.first_name) LIKE $${paramIndex}
        OR LOWER(m.last_name) LIKE $${paramIndex}
        OR LOWER(COALESCE(m.contact, '')) LIKE $${paramIndex}
      )`);
      params.push(searchPattern);
      paramIndex++;
    }

    // Status filter (cast enum to text for comparison)
    if (options.statusFilters && options.statusFilters.length > 0) {
      conditions.push(`m.record_status::text = ANY($${paramIndex}::text[])`);
      params.push(options.statusFilters);
      paramIndex++;
    }

    // GDI filter
    if (options.gdiFilters && options.gdiFilters.length > 0) {
      const hasNoGdiFilter = options.gdiFilters.includes('no-gdi-assigned');
      const specificGdis = options.gdiFilters
        .filter(g => g !== 'no-gdi-assigned')
        .map(g => parseInt(g, 10))
        .filter(g => !isNaN(g));

      if (hasNoGdiFilter && specificGdis.length > 0) {
        // Either no GDI OR specific GDIs
        conditions.push(`(
          NOT EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id)
          OR EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id AND gm.gdi_id = ANY($${paramIndex}::int[]))
        )`);
        params.push(specificGdis);
        paramIndex++;
      } else if (hasNoGdiFilter) {
        // Only no GDI
        conditions.push(`NOT EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id)`);
      } else if (specificGdis.length > 0) {
        // Only specific GDIs
        conditions.push(`EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id AND gm.gdi_id = ANY($${paramIndex}::int[]))`);
        params.push(specificGdis);
        paramIndex++;
      }
    }

    // Area filter
    if (options.areaFilters && options.areaFilters.length > 0) {
      const hasNoAreaFilter = options.areaFilters.includes('no-area-assigned');
      const specificAreas = options.areaFilters
        .filter(a => a !== 'no-area-assigned')
        .map(a => parseInt(a, 10))
        .filter(a => !isNaN(a));

      if (hasNoAreaFilter && specificAreas.length > 0) {
        conditions.push(`(
          NOT EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id)
          OR EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id AND am.area_id = ANY($${paramIndex}::int[]))
        )`);
        params.push(specificAreas);
        paramIndex++;
      } else if (hasNoAreaFilter) {
        conditions.push(`NOT EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id)`);
      } else if (specificAreas.length > 0) {
        conditions.push(`EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id AND am.area_id = ANY($${paramIndex}::int[]))`);
        params.push(specificAreas);
        paramIndex++;
      }
    }

    // Role filter
    if (options.roleFilters && options.roleFilters.length > 0) {
      const roleConditions: string[] = [];
      const hasNoRoleFilter = options.roleFilters.includes('no-role-assigned');

      if (options.roleFilters.includes('Leader')) {
        roleConditions.push(`(
          EXISTS(SELECT 1 FROM gdis WHERE guide_id = m.member_id)
          OR EXISTS(SELECT 1 FROM gdis WHERE mentor_id = m.member_id)
          OR EXISTS(SELECT 1 FROM areas WHERE leader_id = m.member_id)
          OR EXISTS(SELECT 1 FROM areas WHERE mentor_id = m.member_id)
        )`);
      }

      if (options.roleFilters.includes('Worker')) {
        roleConditions.push(`(
          (EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id)
           OR EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id))
          AND NOT EXISTS(SELECT 1 FROM gdis WHERE guide_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM gdis WHERE mentor_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM areas WHERE leader_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM areas WHERE mentor_id = m.member_id)
        )`);
      }

      if (hasNoRoleFilter) {
        roleConditions.push(`(
          NOT EXISTS(SELECT 1 FROM gdi_memberships gm WHERE gm.member_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM area_memberships am WHERE am.member_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM gdis WHERE guide_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM gdis WHERE mentor_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM areas WHERE leader_id = m.member_id)
          AND NOT EXISTS(SELECT 1 FROM areas WHERE mentor_id = m.member_id)
        )`);
      }

      if (roleConditions.length > 0) {
        conditions.push(`(${roleConditions.join(' OR ')})`);
      }
    }

    return { conditions, params };
  }

  // ==========================================
  // PRIVATE MAPPING METHODS
  // ==========================================

  /**
   * Map raw query result to Read Model
   */
  private mapRawToReadModel(raw: MemberWithAssignmentsRaw): MemberWithAssignmentsReadModel {
    // Build assigned GDI info
    const assignedGdi: GdiAssignment | undefined =
      raw.gdi_id && raw.gdi_name
        ? { id: raw.gdi_id, name: raw.gdi_name }
        : undefined;

    // Build assigned areas info
    const assignedAreas: AreaAssignment[] = [];
    if (raw.area_ids && raw.area_names) {
      for (let i = 0; i < raw.area_ids.length; i++) {
        if (raw.area_ids[i] && raw.area_names[i]) {
          assignedAreas.push({
            id: raw.area_ids[i],
            name: raw.area_names[i],
          });
        }
      }
    }

    // Calculate roles based on boolean flags from CTE
    const roles: MemberRoleType[] = [];
    if (raw.is_gdi_guide) roles.push('GdiGuide');
    if (raw.is_gdi_mentor) roles.push('GdiMentor');
    if (raw.is_area_leader) roles.push('AreaLeader');
    if (raw.is_area_mentor) roles.push('AreaMentor');
    // If member belongs to any group but has no leadership role, they're a worker
    if (roles.length === 0 && (assignedGdi || assignedAreas.length > 0)) {
      roles.push('Worker');
    }

    // Build ecclesiastical roles
    const ecclesiasticalRoles: EcclesiasticalRole[] = [];
    if (raw.ecclesiastical_role_type_ids && raw.ecclesiastical_role_names) {
      for (let i = 0; i < raw.ecclesiastical_role_type_ids.length; i++) {
        if (raw.ecclesiastical_role_type_ids[i] && raw.ecclesiastical_role_names[i]) {
          ecclesiasticalRoles.push({
            roleTypeId: raw.ecclesiastical_role_type_ids[i],
            name: raw.ecclesiastical_role_names[i],
          });
        }
      }
    }

    return {
      id: raw.member_id,
      firstName: raw.first_name,
      lastName: raw.last_name,
      fullName: `${raw.first_name} ${raw.last_name}`,
      contact: raw.contact ?? undefined,
      recordStatus: raw.record_status,
      birthDate: raw.birth_date ?? undefined,
      baptismDate: raw.baptism_date ?? undefined,
      joinDate: raw.join_date ?? undefined,
      bibleStudy: raw.bible_study,
      typeBibleStudy: raw.type_bible_study ?? undefined,
      address: raw.address ?? undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      assignedGdi,
      assignedAreas,
      roles,
      ecclesiasticalRoles,
    };
  }

  /**
   * Example using stored procedure
   */
  async findAllWithStoredProcedure(): Promise<Member[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_members');
    const entities: MemberEntity[] = result.map(raw => Object.assign(new MemberEntity(), raw));
    return MemberMapper.toDomainArray(entities);
  }
}
