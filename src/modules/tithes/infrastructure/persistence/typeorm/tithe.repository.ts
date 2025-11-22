import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TitheEntity } from './tithe.typeorm.entity';
import { ITitheRepository } from '../../../domain/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.entity';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';

@Injectable()
export class TitheRepository extends BaseRepository<TitheEntity> implements ITitheRepository {
  constructor(
    @InjectRepository(TitheEntity)
    private readonly titheRepository: Repository<TitheEntity>,
    dataSource: DataSource,
  ) {
    super(titheRepository, dataSource);
  }

  async findAll(): Promise<Tithe[]> {
    return await this.titheRepository.find();
  }

  async findById(id: number): Promise<Tithe | null> {
    return await this.titheRepository.findOne({ where: { titheId: id } });
  }

  async findByMember(memberId: number): Promise<Tithe[]> {
    return await this.titheRepository.find({ where: { memberId } });
  }

  async findByYearAndMonth(year: number, month: number): Promise<Tithe[]> {
    return await this.titheRepository.find({ where: { year, month } });
  }

  async upsert(memberId: number, year: number, month: number): Promise<Tithe> {
    // Usando stored procedure para UPSERT
    const result = await this.executeStoredProcedure<Tithe[]>(
      'sp_upsert_tithe',
      [memberId, year, month]
    );
    return result[0];
  }

  async batchUpsert(tithes: Array<{ memberId: number; year: number; month: number }>): Promise<Tithe[]> {
    // Ejemplo con transacción y stored procedure
    return await this.withTransaction(async (manager) => {
      const results: Tithe[] = [];
      for (const tithe of tithes) {
        const result = await manager.query(
          'SELECT * FROM sp_upsert_tithe($1, $2, $3)',
          [tithe.memberId, tithe.year, tithe.month]
        );
        results.push(result[0]);
      }
      return results;
    });
  }

  async delete(id: number): Promise<void> {
    await this.titheRepository.delete(id);
  }
}
