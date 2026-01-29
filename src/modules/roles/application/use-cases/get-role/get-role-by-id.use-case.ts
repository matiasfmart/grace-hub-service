import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { MemberRole } from '../../../domain/member-role.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Get Role By Id
 *
 * Application layer - orchestrates domain operations
 */
@Injectable()
export class GetRoleByIdUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly memberRoleRepository: IMemberRoleRepository,
  ) {}

  async execute(id: number): Promise<MemberRole> {
    const role = await this.memberRoleRepository.findById(id);

    if (!role) {
      throw new EntityNotFoundException('MemberRole', id);
    }

    return role;
  }
}
