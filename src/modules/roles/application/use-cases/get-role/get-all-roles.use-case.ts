import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { MemberRole } from '../../../domain/member-role.aggregate';

@Injectable()
export class GetAllRolesUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly roleRepository: IMemberRoleRepository,
  ) {}

  async execute(): Promise<MemberRole[]> {
    return await this.roleRepository.findAll();
  }
}
