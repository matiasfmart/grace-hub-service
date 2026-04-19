import { Inject, Injectable } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';

/**
 * Use Case: Get Tithes By Member
 *
 * Returns the full tithe history for a specific member.
 * Used by the member detail dialog to show tithe progression over time.
 */
@Injectable()
export class GetTithesByMemberUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(memberId: number): Promise<Tithe[]> {
    return this.titheRepository.findByMember(memberId);
  }
}
