import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { Gdi } from '../../../domain/gdi.aggregate';

/**
 * Use Case: Get all GDIs
 *
 * Simple query use case
 */
@Injectable()
export class GetAllGdisUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(): Promise<Gdi[]> {
    return await this.gdiRepository.findAll();
  }
}
