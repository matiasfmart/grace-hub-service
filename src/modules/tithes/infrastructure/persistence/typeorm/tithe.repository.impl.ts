import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TitheEntity } from './tithe.typeorm.entity';
import { ITitheRepository } from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { TitheMapper } from './mappers/tithe.mapper';

@Injectable()
export class TitheRepositoryImpl
  extends BaseRepository<TitheEntity>
  implements ITitheRepository
{
  constructor(
    @InjectRepository(TitheEntity)
    private readonly titheRepository: Repository<TitheEntity>,
    dataSource: DataSource,
  ) {
    super(titheRepository, dataSource);
  }

  async save(tithe: Tithe): Promise<Tithe> {
    const entity = TitheMapper.toPersistence(tithe);
    const savedEntity = await this.titheRepository.save(entity);
    return TitheMapper.toDomain(savedEntity);
  }

  async saveMany(tithes: Tithe[]): Promise<Tithe[]> {
    const entities = tithes.map(tithe => TitheMapper.toPersistence(tithe));
    const savedEntities = await this.titheRepository.save(entities);
    return TitheMapper.toDomainArray(savedEntities);
  }

  async findById(id: number): Promise<Tithe | null> {
    const entity = await this.titheRepository.findOne({
      where: { titheId: id },
    });
    return entity ? TitheMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Tithe[]> {
    const entities = await this.titheRepository.find();
    return TitheMapper.toDomainArray(entities);
  }

  async findByMember(memberId: number): Promise<Tithe[]> {
    const entities = await this.titheRepository.find({
      where: { memberId },
    });
    return TitheMapper.toDomainArray(entities);
  }

  async findByYear(year: number): Promise<Tithe[]> {
    const entities = await this.titheRepository.find({
      where: { year },
    });
    return TitheMapper.toDomainArray(entities);
  }

  async findByYearAndMonth(year: number, month: number): Promise<Tithe[]> {
    const entities = await this.titheRepository.find({
      where: { year, month },
    });
    return TitheMapper.toDomainArray(entities);
  }

  async findByMemberYearMonth(memberId: number, year: number, month: number): Promise<Tithe | null> {
    const entity = await this.titheRepository.findOne({
      where: { memberId, year, month },
    });
    return entity ? TitheMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.titheRepository.delete(id);
  }

  async deleteByMemberYearMonth(memberId: number, year: number, month: number): Promise<void> {
    await this.titheRepository.delete({ memberId, year, month });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.titheRepository.count({
      where: { titheId: id },
    });
    return count > 0;
  }
}
