import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GdiEntity } from './gdi.typeorm.entity';
import { IGdiRepository } from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';
import { GdiWithStats } from '../../../domain/read-models/gdi-with-stats.read-model';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { GdiMapper } from './mappers/gdi.mapper';

/**
 * TypeORM Implementation of IGdiRepository
 *
 * This class belongs to the Infrastructure layer
 */
@Injectable()
export class GdiRepositoryImpl
  extends BaseRepository<GdiEntity>
  implements IGdiRepository
{
  constructor(
    @InjectRepository(GdiEntity)
    private readonly gdiRepository: Repository<GdiEntity>,
    dataSource: DataSource,
  ) {
    super(gdiRepository, dataSource);
  }

  async save(gdi: Gdi): Promise<Gdi> {
    const entity = GdiMapper.toPersistence(gdi);
    const savedEntity = await this.gdiRepository.save(entity);
    return GdiMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Gdi | null> {
    const entity = await this.gdiRepository.findOne({
      where: { gdiId: id },
    });

    return entity ? GdiMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Gdi[]> {
    const entities = await this.gdiRepository.find();
    return GdiMapper.toDomainArray(entities);
  }

  async findByGuide(guideId: number): Promise<Gdi[]> {
    const entities = await this.gdiRepository.find({
      where: { guideId },
    });
    return GdiMapper.toDomainArray(entities);
  }

  async findByMentor(mentorId: number): Promise<Gdi[]> {
    const entities = await this.gdiRepository.find({
      where: { mentorId },
    });
    return GdiMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.gdiRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.gdiRepository.count({
      where: { gdiId: id },
    });
    return count > 0;
  }

  /**
   * Returns all GDIs enriched with computed health statistics.
   * Uses a single SQL JOIN across meeting_series, meetings and attendance tables.
   * No user input → no parameterization needed (no injection risk).
   */
  async findAllWithStats(): Promise<GdiWithStats[]> {
    const sql = `
      SELECT
        g.gdi_id        AS "gdiId",
        g.name          AS "name",
        g.guide_id      AS "guideId",
        g.mentor_id     AS "mentorId",
        g.created_at    AS "createdAt",
        g.updated_at    AS "updatedAt",
        MAX(m.date)::text AS "lastMeetingDate",
        CASE
          WHEN COUNT(a.attendance_id) = 0 THEN NULL
          ELSE ROUND(
            100.0 * SUM(CASE WHEN a.was_present THEN 1 ELSE 0 END)
            / COUNT(a.attendance_id)
          )::integer
        END AS "avgAttendancePct"
      FROM gdis g
      LEFT JOIN meeting_series ms ON ms.gdi_id = g.gdi_id
      LEFT JOIN meetings m
        ON m.series_id = ms.series_id
        AND m.date <= CURRENT_DATE
      LEFT JOIN attendance a ON a.meeting_id = m.meeting_id
      GROUP BY g.gdi_id, g.name, g.guide_id, g.mentor_id, g.created_at, g.updated_at
      ORDER BY g.name ASC
    `;
    return this.executeQuery<GdiWithStats[]>(sql);
  }

  /**
   * Example using stored procedure
   */
  async findAllWithStoredProcedure(): Promise<Gdi[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_gdis');
    const entities: GdiEntity[] = result.map(raw => Object.assign(new GdiEntity(), raw));
    return GdiMapper.toDomainArray(entities);
  }
}
