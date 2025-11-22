import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GdiEntity } from './gdi.typeorm.entity';
import { IGdiRepository } from '../../../domain/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.entity';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';

@Injectable()
export class GdiRepository extends BaseRepository<GdiEntity> implements IGdiRepository {
  constructor(
    @InjectRepository(GdiEntity)
    private readonly gdiRepository: Repository<GdiEntity>,
    dataSource: DataSource,
  ) {
    super(gdiRepository, dataSource);
  }

  async findAll(): Promise<Gdi[]> {
    return await this.gdiRepository.find();
  }

  async findById(id: number): Promise<Gdi | null> {
    return await this.gdiRepository.findOne({ where: { gdiId: id } });
  }

  async create(gdi: Partial<Gdi>): Promise<Gdi> {
    const newGdi = this.gdiRepository.create(gdi);
    return await this.gdiRepository.save(newGdi);
  }

  async update(id: number, gdi: Partial<Gdi>): Promise<Gdi> {
    await this.gdiRepository.update(id, gdi);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.gdiRepository.delete(id);
  }
}
