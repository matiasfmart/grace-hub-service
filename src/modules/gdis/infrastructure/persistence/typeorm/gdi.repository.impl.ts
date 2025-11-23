import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GdiEntity } from './gdi.typeorm.entity';
import { IGdiRepository } from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';
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
   * Example using stored procedure
   */
  async findAllWithStoredProcedure(): Promise<Gdi[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_gdis');
    const entities: GdiEntity[] = result.map(raw => Object.assign(new GdiEntity(), raw));
    return GdiMapper.toDomainArray(entities);
  }
}
