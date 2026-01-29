import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { DeleteAreaCommand } from '../../commands/delete-area.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Delete Area
 *
 * Application layer - orchestrates domain operations
 * Validates existence before deletion
 */
@Injectable()
export class DeleteAreaUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(command: DeleteAreaCommand): Promise<void> {
    // Verify Area exists
    const exists = await this.areaRepository.exists(command.id);

    if (!exists) {
      throw new EntityNotFoundException('Area', command.id);
    }

    // Delete Area
    await this.areaRepository.delete(command.id);
  }
}
