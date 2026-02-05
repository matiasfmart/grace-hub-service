import { Inject, Injectable } from '@nestjs/common';
import {
  IGdiMembershipRepository,
  GDI_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/gdi-membership.repository.interface';
import {
  IGdiRepository,
  GDI_REPOSITORY,
} from '../../../domain/repositories/gdi.repository.interface';
import { GdiMembership } from '../../../domain/gdi-membership.aggregate';
import { AssignMemberToGdiCommand } from '../../commands/assign-member-to-gdi.command';
import { BusinessRuleViolationException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Assign Member to GDI
 *
 * Business Rules:
 * - GDI must exist
 * - A member can only belong to ONE GDI
 * - If member already has a GDI, it will be removed first
 */
@Injectable()
export class AssignMemberToGdiUseCase {
  constructor(
    @Inject(GDI_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IGdiMembershipRepository,
    @Inject(GDI_REPOSITORY)
    private readonly gdiRepository: IGdiRepository,
  ) {}

  async execute(command: AssignMemberToGdiCommand): Promise<GdiMembership> {
    // Validate GDI exists
    const gdiExists = await this.gdiRepository.exists(command.gdiId);
    if (!gdiExists) {
      throw new BusinessRuleViolationException(
        `GDI with ID ${command.gdiId} does not exist`,
      );
    }

    // Check if member already has a GDI and remove it
    const existingMembership = await this.membershipRepository.findByMemberId(
      command.memberId,
    );
    if (existingMembership) {
      // If already in the same GDI, just return existing
      if (existingMembership.gdiId === command.gdiId) {
        return existingMembership;
      }
      // Remove from previous GDI
      await this.membershipRepository.deleteByMemberId(command.memberId);
    }

    // Create new membership
    const membership = GdiMembership.create(command.gdiId, command.memberId);

    // Persist
    return await this.membershipRepository.save(membership);
  }
}
