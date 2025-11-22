import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AreaEntity } from './area.typeorm.entity';
import { IAreaRepository } from '../../../domain/area.repository.interface';
import { Area } from '../../../domain/area.entity';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';

@Injectable()
export class AreaRepository extends BaseRepository<AreaEntity> implements IAreaRepository {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
    dataSource: DataSource,
  ) {
    super(areaRepository, dataSource);
  }

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find();
  }

  async findById(id: number): Promise<Area | null> {
    return await this.areaRepository.findOne({ where: { areaId: id } });
  }

  async create(area: Partial<Area>): Promise<Area> {
    const newArea = this.areaRepository.create(area);
    return await this.areaRepository.save(newArea);
  }

  async update(id: number, area: Partial<Area>): Promise<Area> {
    await this.areaRepository.update(id, area);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.areaRepository.delete(id);
  }
}
