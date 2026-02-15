import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaMembershipRepository,
  AREA_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/area-membership.repository.interface';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { AreaMembership } from '../../../domain/area-membership.aggregate';
import { AssignMemberToAreaCommand } from '../../commands/assign-member-to-area.command';
import { BusinessRuleViolationException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Assign Member to Area
 *
 * Business Rules:
 * - Area must exist
 * - Member can belong to multiple areas
 * - Only ACTIVE members can be assigned (validated at controller/dto level)
 *
 * Note: Members without GDI can be assigned to areas, but the UI should
 * show a warning indicating they should be assigned to a GDI first.
 */
@Injectable()
export class AssignMemberToAreaUseCase {
  constructor(
    @Inject(AREA_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IAreaMembershipRepository,
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(command: AssignMemberToAreaCommand): Promise<AreaMembership> {
    // Validate Area exists
    const areaExists = await this.areaRepository.exists(command.areaId);
    if (!areaExists) {
      throw new BusinessRuleViolationException(
        `Area with ID ${command.areaId} does not exist`,
      );
    }

    // Check if already exists
    const alreadyExists = await this.membershipRepository.exists(
      command.areaId,
      command.memberId,
    );
    if (alreadyExists) {
      // Return existing (idempotent operation)
      const memberships = await this.membershipRepository.findByAreaId(command.areaId);
      return memberships.find((m) => m.memberId === command.memberId)!;
    }

    // Create new membership
    const membership = AreaMembership.create(command.areaId, command.memberId);

    // Persist
    return await this.membershipRepository.save(membership);
  }
}
