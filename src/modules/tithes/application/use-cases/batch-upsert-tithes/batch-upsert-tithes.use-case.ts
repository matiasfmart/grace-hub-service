import { Inject, Injectable } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';

export interface TitheBatchItem {
  memberId: number;
  year: number;
  month: number;
  didTithe: boolean;
}

/**
 * Use Case: Batch Upsert Tithes
 *
 * Processes multiple tithe records at once:
 * - If didTithe is true: Creates record if doesn't exist
 * - If didTithe is false: Deletes record if exists
 */
@Injectable()
export class BatchUpsertTithesUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(items: TitheBatchItem[]): Promise<{ created: number; deleted: number }> {
    let created = 0;
    let deleted = 0;

    for (const item of items) {
      const existingTithe = await this.titheRepository.findByMemberYearMonth(
        item.memberId,
        item.year,
        item.month,
      );

      if (item.didTithe) {
        // Should have a tithe record
        if (!existingTithe) {
          const newTithe = Tithe.create(item.memberId, item.year, item.month);
          await this.titheRepository.save(newTithe);
          created++;
        }
        // If exists, nothing to do
      } else {
        // Should NOT have a tithe record
        if (existingTithe) {
          await this.titheRepository.deleteByMemberYearMonth(
            item.memberId,
            item.year,
            item.month,
          );
          deleted++;
        }
        // If doesn't exist, nothing to do
      }
    }

    return { created, deleted };
  }
}
