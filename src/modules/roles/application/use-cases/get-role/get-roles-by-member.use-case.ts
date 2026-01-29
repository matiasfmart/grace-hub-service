import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { MemberRole } from '../../../domain/member-role.aggregate';

/**
 * Use Case: Get Roles By Member
 *
 * Application layer - orchestrates domain operations
 * Returns all roles assigned to a specific member
 */
@Injectable()
export class GetRolesByMemberUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly memberRoleRepository: IMemberRoleRepository,
  ) {}

  async execute(memberId: number): Promise<MemberRole[]> {
    return await this.memberRoleRepository.findByMember(memberId);
  }
}
