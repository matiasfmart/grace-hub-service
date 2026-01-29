import { Inject, Injectable } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';

/**
 * Use Case: Get Tithes By Year And Month
 *
 * Returns all tithe records for a specific year and month
 */
@Injectable()
export class GetTithesByYearMonthUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(year: number, month: number): Promise<Tithe[]> {
    return await this.titheRepository.findByYearAndMonth(year, month);
  }
}
