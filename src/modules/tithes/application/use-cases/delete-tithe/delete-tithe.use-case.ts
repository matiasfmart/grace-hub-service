import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';

/**
 * Use Case: Delete Tithe
 *
 * Validates that the tithe record exists before deleting it.
 * Used when a tithe entry needs to be individually removed.
 */
@Injectable()
export class DeleteTitheUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.titheRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Tithe with id ${id} not found`);
    }
    await this.titheRepository.delete(id);
  }
}
