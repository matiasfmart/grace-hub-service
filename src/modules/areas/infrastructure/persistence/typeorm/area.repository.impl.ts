import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AreaEntity } from './area.typeorm.entity';
import { IAreaRepository } from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';
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

  async findAllWithStoredProcedure(): Promise<Area[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_areas');
    const entities: AreaEntity[] = result.map(raw => Object.assign(new AreaEntity(), raw));
    return AreaMapper.toDomainArray(entities);
  }
}
