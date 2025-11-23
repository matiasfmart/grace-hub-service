import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRoleRepository,
  MEMBER_ROLE_REPOSITORY,
} from '../../../domain/repositories/member-role.repository.interface';
import { MemberRole } from '../../../domain/member-role.aggregate';
import { CreateRoleCommand } from '../../commands/create-role.command';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly roleRepository: IMemberRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<MemberRole> {
    const role = MemberRole.create(
      command.memberId,
      command.roleGeneral,
    );
    const savedRole = await this.roleRepository.save(role);
    savedRole.clearEvents();
    return savedRole;
  }
}
