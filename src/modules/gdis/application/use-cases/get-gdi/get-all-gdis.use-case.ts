import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { GdiWithStats } from '../../../domain/read-models/gdi-with-stats.read-model';

/**
 * Use Case: Get all GDIs with health statistics
 *
 * Returns GDIs enriched with computed avgAttendancePct and lastMeetingDate
 * for display on the groups listing page.
 */
@Injectable()
export class GetAllGdisUseCase {
  constructor(
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(): Promise<GdiWithStats[]> {
    return await this.gdiRepository.findAllWithStats();
  }
}
