import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMemberRoleTypeRepository,
  MEMBER_ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/member-role-type.repository.interface';
import {
  IRoleTypeRepository,
  ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/role-type.repository.interface';
import { AssignRoleTypeToMemberCommand } from './assign-role-type-to-member.command';

/**
 * Use Case: Assign Role Type to Member
 *
 * Assigns an ecclesiastical label to a member.
 * Idempotent: assigning an already-assigned label is a no-op.
 *
 * Business Rules:
 * - The role type must exist.
 */
@Injectable()
export class AssignRoleTypeToMemberUseCase {
  constructor(
    @Inject(MEMBER_ROLE_TYPE_REPOSITORY)
    private readonly memberRoleTypeRepository: IMemberRoleTypeRepository,
    @Inject(ROLE_TYPE_REPOSITORY)
    private readonly roleTypeRepository: IRoleTypeRepository,
  ) {}

  async execute(command: AssignRoleTypeToMemberCommand): Promise<void> {
    // Guard: role type must exist
    const roleType = await this.roleTypeRepository.findById(command.roleTypeId);
    if (!roleType) {
      throw new NotFoundException(`Role type with id ${command.roleTypeId} not found`);
    }

    // Idempotent assignment
    await this.memberRoleTypeRepository.assign(command.memberId, command.roleTypeId);
  }
}
