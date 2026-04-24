import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AreaEntity } from './area.typeorm.entity';
import { IAreaRepository } from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';
import { AreaWithStats } from '../../../domain/read-models/area-with-stats.read-model';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { AreaMapper } from './mappers/area.mapper';

@Injectable()
export class AreaRepositoryImpl
  extends BaseRepository<AreaEntity>
  implements IAreaRepository
{
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
    dataSource: DataSource,
  ) {
    super(areaRepository, dataSource);
  }

  async save(area: Area): Promise<Area> {
    const entity = AreaMapper.toPersistence(area);
    const savedEntity = await this.areaRepository.save(entity);
    return AreaMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Area | null> {
    const entity = await this.areaRepository.findOne({
      where: { areaId: id },
    });

    return entity ? AreaMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Area[]> {
    const entities = await this.areaRepository.find();
    return AreaMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.areaRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.areaRepository.count({
      where: { areaId: id },
    });
    return count > 0;
  }

  /**
   * Returns all Ministry Areas enriched with computed health statistics.
   * Uses a single SQL JOIN across meeting_series, meetings and attendance tables.
   * No user input → no parameterization needed (no injection risk).
   */
  async findAllWithStats(): Promise<AreaWithStats[]> {
    const sql = `
      SELECT
        a.area_id       AS "areaId",
        a.name          AS "name",
        a.leader_id     AS "leaderId",
        a.mentor_id     AS "mentorId",
        a.created_at    AS "createdAt",
        a.updated_at    AS "updatedAt",
        MAX(m.date)::text AS "lastMeetingDate",
        CASE
          WHEN COUNT(att.attendance_id) = 0 THEN NULL
          ELSE ROUND(
            100.0 * SUM(CASE WHEN att.was_present THEN 1 ELSE 0 END)
            / COUNT(att.attendance_id)
          )::integer
        END AS "avgAttendancePct"
      FROM areas a
      LEFT JOIN meeting_series ms ON ms.area_id = a.area_id
      LEFT JOIN meetings m
        ON m.series_id = ms.series_id
        AND m.date <= CURRENT_DATE
      LEFT JOIN attendance att ON att.meeting_id = m.meeting_id
      GROUP BY a.area_id, a.name, a.leader_id, a.mentor_id, a.created_at, a.updated_at
      ORDER BY a.name ASC
    `;
    return this.executeQuery<AreaWithStats[]>(sql);
  }

  async findAllWithStoredProcedure(): Promise<Area[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_areas');
    const entities: AreaEntity[] = result.map(raw => Object.assign(new AreaEntity(), raw));
    return AreaMapper.toDomainArray(entities);
  }
}
