import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';
import { GdiName } from '../../../domain/value-objects/gdi-name.vo';
import { CreateGdiCommand } from '../../commands/create-gdi.command';

/**
 * Use Case: Create a new GDI
 *
 * Follows Single Responsibility Principle:
 * - Validates command
 * - Creates domain aggregate
 * - Persists via repository
 */
@Injectable()
export class CreateGdiUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(command: CreateGdiCommand): Promise<Gdi> {
    // Create Value Objects
    const name = GdiName.create(command.name);

    // Create Aggregate using factory method
    const gdi = Gdi.create(name, command.guideId, command.mentorId);

    // Persist
    const savedGdi = await this.gdiRepository.save(gdi);

    // Domain events would be published here in a real implementation
    savedGdi.clearEvents();

    return savedGdi;
  }
}
