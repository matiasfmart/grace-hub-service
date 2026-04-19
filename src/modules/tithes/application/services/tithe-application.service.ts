import { Injectable } from '@nestjs/common';
import { CreateTitheUseCase } from '../use-cases/create-tithe/create-tithe.use-case';
import { GetAllTithesUseCase } from '../use-cases/get-tithe/get-all-tithes.use-case';
import { GetTithesByYearMonthUseCase } from '../use-cases/get-tithe/get-tithes-by-year-month.use-case';
import { GetTithesByMemberUseCase } from '../use-cases/get-tithe/get-tithes-by-member.use-case';
import { BatchUpsertTithesUseCase, TitheBatchItem } from '../use-cases/batch-upsert-tithes/batch-upsert-tithes.use-case';
import { DeleteTitheUseCase } from '../use-cases/delete-tithe/delete-tithe.use-case';
import { CreateTitheCommand } from '../commands/create-tithe.command';
import { Tithe } from '../../domain/tithe.aggregate';

@Injectable()
export class TitheApplicationService {
  constructor(
    private readonly createTitheUseCase: CreateTitheUseCase,
    private readonly getAllTithesUseCase: GetAllTithesUseCase,
    private readonly getTithesByYearMonthUseCase: GetTithesByYearMonthUseCase,
    private readonly getTithesByMemberUseCase: GetTithesByMemberUseCase,
    private readonly batchUpsertTithesUseCase: BatchUpsertTithesUseCase,
    private readonly deleteTitheUseCase: DeleteTitheUseCase,
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

  async getTithesByMember(memberId: number): Promise<Tithe[]> {
    return this.getTithesByMemberUseCase.execute(memberId);
  }

  async deleteTithe(id: number): Promise<void> {
    return this.deleteTitheUseCase.execute(id);
  }

  async batchUpsertTithes(items: TitheBatchItem[]): Promise<{ created: number; deleted: number }> {
    return await this.batchUpsertTithesUseCase.execute(items);
  }
}
