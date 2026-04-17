import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MeetingSeriesEntity } from './meeting-series.typeorm.entity';
import { IMeetingSeriesRepository } from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { MeetingSeriesMapper } from './mappers/meeting-series.mapper';
import { AudienceType } from '../../../../../core/common/constants/status.constants';

@Injectable()
export class MeetingSeriesRepositoryImpl
  extends BaseRepository<MeetingSeriesEntity>
  implements IMeetingSeriesRepository
{
  constructor(
    @InjectRepository(MeetingSeriesEntity)
    private readonly seriesRepository: Repository<MeetingSeriesEntity>,
    dataSource: DataSource,
  ) {
    super(seriesRepository, dataSource);
  }

  async save(series: MeetingSeries): Promise<MeetingSeries> {
    const entity = MeetingSeriesMapper.toPersistence(series);
    const savedEntity = await this.seriesRepository.save(entity);
    return MeetingSeriesMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<MeetingSeries[]> {
    const entities = await this.seriesRepository.find({
      order: { createdAt: 'DESC' },
    });
    return MeetingSeriesMapper.toDomainArray(entities);
  }

  async findById(id: number): Promise<MeetingSeries | null> {
    const entity = await this.seriesRepository.findOne({
      where: { seriesId: id },
    });
    return entity ? MeetingSeriesMapper.toDomain(entity) : null;
  }

  async findByGdiId(gdiId: number): Promise<MeetingSeries[]> {
    const entities = await this.seriesRepository.find({
      where: { gdiId },
    });
    return MeetingSeriesMapper.toDomainArray(entities);
  }

  async findByAreaId(areaId: number): Promise<MeetingSeries[]> {
    const entities = await this.seriesRepository.find({
      where: { areaId },
    });
    return MeetingSeriesMapper.toDomainArray(entities);
  }

  async findByAudienceType(audienceType: AudienceType): Promise<MeetingSeries[]> {
    const entities = await this.seriesRepository.find({
      where: { audienceType },
    });
    return MeetingSeriesMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.seriesRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.seriesRepository.count({
      where: { seriesId: id },
    });
    return count > 0;
  }
}
