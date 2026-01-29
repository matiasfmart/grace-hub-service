import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { DeleteRoleCommand } from '../../commands/delete-role.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Delete Role
 *
 * Application layer - orchestrates domain operations
 * Validates existence before deletion
 */
@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly memberRoleRepository: IMemberRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    // Verify Role exists
    const exists = await this.memberRoleRepository.exists(command.id);

    if (!exists) {
      throw new EntityNotFoundException('MemberRole', command.id);
    }

    // Delete Role
    await this.memberRoleRepository.delete(command.id);
  }
}
