import { Injectable } from '@nestjs/common';
import { CreateTitheUseCase } from '../use-cases/create-tithe/create-tithe.use-case';
import { GetAllTithesUseCase } from '../use-cases/get-tithe/get-all-tithes.use-case';
import { GetTithesByYearMonthUseCase } from '../use-cases/get-tithe/get-tithes-by-year-month.use-case';
import { BatchUpsertTithesUseCase, TitheBatchItem } from '../use-cases/batch-upsert-tithes/batch-upsert-tithes.use-case';
import { CreateTitheCommand } from '../commands/create-tithe.command';
import { Tithe } from '../../domain/tithe.aggregate';

@Injectable()
export class TitheApplicationService {
  constructor(
    private readonly createTitheUseCase: CreateTitheUseCase,
    private readonly getAllTithesUseCase: GetAllTithesUseCase,
    private readonly getTithesByYearMonthUseCase: GetTithesByYearMonthUseCase,
    private readonly batchUpsertTithesUseCase: BatchUpsertTithesUseCase,
  ) {}

  async createTithe(command: CreateTitheCommand): Promise<Tithe> {
    return await this.createTitheUseCase.execute(command);
  }

  async getAllTithes(): Promise<Tithe[]> {
    return await this.getAllTithesUseCase.execute();
  }

  async getTithesByYearAndMonth(year: number, month: number): Promise<Tithe[]> {
    return await this.getTithesByYearMonthUseCase.execute(year, month);
  }

  async batchUpsertTithes(items: TitheBatchItem[]): Promise<{ created: number; deleted: number }> {
    return await this.batchUpsertTithesUseCase.execute(items);
  }
}
