import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IRoleTypeRepository,
  ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/role-type.repository.interface';

/**
 * Use Case: Delete Role Type
 * 
 * Removes an ecclesiastical label.
 * Note: member_roles entries will be cascade deleted by the DB.
 */
@Injectable()
export class DeleteRoleTypeUseCase {
  constructor(
    @Inject(ROLE_TYPE_REPOSITORY)
    private readonly roleTypeRepository: IRoleTypeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const roleType = await this.roleTypeRepository.findById(id);
    if (!roleType) {
      throw new NotFoundException(`Role type with ID ${id} not found`);
    }

    await this.roleTypeRepository.delete(id);
  }
}
