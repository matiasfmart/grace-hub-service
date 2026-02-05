import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiMembershipRepository,
  GDI_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/gdi-membership.repository.interface';

/**
 * Use Case: Get Members of a GDI
 *
 * Returns all member IDs assigned to a specific GDI
 */
@Injectable()
export class GetGdiMembersUseCase {
  constructor(
    @Inject(GDI_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IGdiMembershipRepository,
  ) {}

  async execute(gdiId: number): Promise<number[]> {
    return await this.membershipRepository.getMemberIdsByGdiId(gdiId);
  }
}
