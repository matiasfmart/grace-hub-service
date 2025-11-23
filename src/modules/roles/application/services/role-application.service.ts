import { Injectable } from '@nestjs/common';
import { CreateRoleUseCase } from '../use-cases/create-role/create-role.use-case';
import { GetAllRolesUseCase } from '../use-cases/get-role/get-all-roles.use-case';
import { CreateRoleCommand } from '../commands/create-role.command';
import { MemberRole } from '../../domain/member-role.aggregate';

@Injectable()
export class RoleApplicationService {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
  ) {}

  async createRole(command: CreateRoleCommand): Promise<MemberRole> {
    return await this.createRoleUseCase.execute(command);
  }

  async getAllRoles(): Promise<MemberRole[]> {
    return await this.getAllRolesUseCase.execute();
  }
}
