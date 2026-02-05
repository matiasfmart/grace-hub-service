import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaMembershipRepository,
  AREA_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/area-membership.repository.interface';
import { RemoveMemberFromAreaCommand } from '../../commands/remove-member-from-area.command';

/**
 * Use Case: Remove Member from Area
 *
 * Removes a member from a specific Area
 */
@Injectable()
export class RemoveMemberFromAreaUseCase {
  constructor(
    @Inject(AREA_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IAreaMembershipRepository,
  ) {}

  async execute(command: RemoveMemberFromAreaCommand): Promise<void> {
    await this.membershipRepository.deleteByAreaIdAndMemberId(
      command.areaId,
      command.memberId,
    );
  }
}
