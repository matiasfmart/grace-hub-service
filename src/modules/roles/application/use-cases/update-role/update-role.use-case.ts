import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { UpdateRoleCommand } from '../../commands/update-role.command';
import { MemberRole } from '../../../domain/member-role.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Update Role
 *
 * Application layer - orchestrates domain operations
 * Validates existence and delegates update to domain aggregate
 */
@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly memberRoleRepository: IMemberRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<MemberRole> {
    // Find existing role
    const role = await this.memberRoleRepository.findById(command.id);

    if (!role) {
      throw new EntityNotFoundException('MemberRole', command.id);
    }

    // Update role using domain method
    if (command.roleGeneral !== undefined) {
      role.updateRole(command.roleGeneral);
    }

    // Persist and return
    return await this.memberRoleRepository.save(role);
  }
}
