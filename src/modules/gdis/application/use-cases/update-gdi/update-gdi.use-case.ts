import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';
import { GdiName } from '../../../domain/value-objects/gdi-name.vo';
import { UpdateGdiCommand } from '../../commands/update-gdi.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Update GDI
 */
@Injectable()
export class UpdateGdiUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(command: UpdateGdiCommand): Promise<Gdi> {
    // Find existing GDI
    const gdi = await this.gdiRepository.findById(command.id);

    if (!gdi) {
      throw new EntityNotFoundException('Gdi', command.id);
    }

    // Update name if provided
    if (command.name) {
      const newName = GdiName.create(command.name);
      gdi.updateName(newName);
    }

    // Update leaders if provided
    if (command.guideId !== undefined || command.mentorId !== undefined) {
      gdi.assignLeaders(command.guideId, command.mentorId);
    }

    // Persist changes
    const updatedGdi = await this.gdiRepository.save(gdi);

    // Clear domain events
    updatedGdi.clearEvents();

    return updatedGdi;
  }
}
