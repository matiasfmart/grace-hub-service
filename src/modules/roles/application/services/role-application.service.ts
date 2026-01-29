import { Injectable } from '@nestjs/common';
import { CreateRoleUseCase } from '../use-cases/create-role/create-role.use-case';
import { GetAllRolesUseCase } from '../use-cases/get-role/get-all-roles.use-case';
import { GetRoleByIdUseCase } from '../use-cases/get-role/get-role-by-id.use-case';
import { GetRolesByMemberUseCase } from '../use-cases/get-role/get-roles-by-member.use-case';
import { UpdateRoleUseCase } from '../use-cases/update-role/update-role.use-case';
import { DeleteRoleUseCase } from '../use-cases/delete-role/delete-role.use-case';
import { CreateRoleCommand } from '../commands/create-role.command';
import { UpdateRoleCommand } from '../commands/update-role.command';
import { DeleteRoleCommand } from '../commands/delete-role.command';
import { MemberRole } from '../../domain/member-role.aggregate';

@Injectable()
export class RoleApplicationService {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly getRolesByMemberUseCase: GetRolesByMemberUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  async createRole(command: CreateRoleCommand): Promise<MemberRole> {
    return await this.createRoleUseCase.execute(command);
  }

  async getAllRoles(): Promise<MemberRole[]> {
    return await this.getAllRolesUseCase.execute();
  }

  async getRoleById(id: number): Promise<MemberRole> {
    return await this.getRoleByIdUseCase.execute(id);
  }

  async getRolesByMember(memberId: number): Promise<MemberRole[]> {
    return await this.getRolesByMemberUseCase.execute(memberId);
  }

  async updateRole(command: UpdateRoleCommand): Promise<MemberRole> {
    return await this.updateRoleUseCase.execute(command);
  }

  async deleteRole(command: DeleteRoleCommand): Promise<void> {
    return await this.deleteRoleUseCase.execute(command);
  }
}
