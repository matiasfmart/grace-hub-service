import { Inject, Injectable } from '@nestjs/common';
import {
  IRoleTypeRepository,
  ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/role-type.repository.interface';
import { RoleType } from '../../../domain/role-type.aggregate';

/**
 * Use Case: Get All Role Types
 * 
 * Returns all configured ecclesiastical labels.
 */
@Injectable()
export class GetAllRoleTypesUseCase {
  constructor(
    @Inject(ROLE_TYPE_REPOSITORY)
    private readonly roleTypeRepository: IRoleTypeRepository,
  ) {}

  async execute(): Promise<RoleType[]> {
    return this.roleTypeRepository.findAll();
  }
}
