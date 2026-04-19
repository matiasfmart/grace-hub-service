import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleTypeRepository,
  MEMBER_ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/member-role-type.repository.interface';
import { RemoveRoleTypeFromMemberCommand } from './remove-role-type-from-member.command';

/**
 * Use Case: Remove Role Type from Member
 *
 * Unassigns an ecclesiastical label from a member.
 * Idempotent: removing a non-existent assignment is a no-op.
 */
@Injectable()
export class RemoveRoleTypeFromMemberUseCase {
  constructor(
    @Inject(MEMBER_ROLE_TYPE_REPOSITORY)
    private readonly memberRoleTypeRepository: IMemberRoleTypeRepository,
  ) {}

  async execute(command: RemoveRoleTypeFromMemberCommand): Promise<void> {
    await this.memberRoleTypeRepository.unassign(command.memberId, command.roleTypeId);
  }
}
