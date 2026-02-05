import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiMembershipRepository,
  GDI_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/gdi-membership.repository.interface';
import { RemoveMemberFromGdiCommand } from '../../commands/remove-member-from-gdi.command';

/**
 * Use Case: Remove Member from GDI
 *
 * Removes a member from a specific GDI
 */
@Injectable()
export class RemoveMemberFromGdiUseCase {
  constructor(
    @Inject(GDI_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IGdiMembershipRepository,
  ) {}

  async execute(command: RemoveMemberFromGdiCommand): Promise<void> {
    await this.membershipRepository.deleteByGdiIdAndMemberId(
      command.gdiId,
      command.memberId,
    );
  }
}
