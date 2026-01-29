import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { DeleteGdiCommand } from '../../commands/delete-gdi.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Delete GDI
 *
 * Application layer - orchestrates domain operations
 * Validates existence before deletion
 */
@Injectable()
export class DeleteGdiUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(command: DeleteGdiCommand): Promise<void> {
    // Verify GDI exists
    const exists = await this.gdiRepository.exists(command.id);

    if (!exists) {
      throw new EntityNotFoundException('Gdi', command.id);
    }

    // Delete GDI
    await this.gdiRepository.delete(command.id);
  }
}
