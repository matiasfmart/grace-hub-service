import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Get GDI by ID
 */
@Injectable()
export class GetGdiByIdUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(id: number): Promise<Gdi> {
    const gdi = await this.gdiRepository.findById(id);

    if (!gdi) {
      throw new EntityNotFoundException('Gdi', id);
    }

    return gdi;
  }
}
