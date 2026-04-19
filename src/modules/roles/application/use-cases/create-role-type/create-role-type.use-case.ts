import { Inject, Injectable, ConflictException } from '@nestjs/common';
import {
  IRoleTypeRepository,
  ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/role-type.repository.interface';
import { RoleType } from '../../../domain/role-type.aggregate';
import { RoleTypeName } from '../../../domain/value-objects/role-type-name.vo';
import { CreateRoleTypeCommand } from '../../commands/create-role-type.command';

/**
 * Use Case: Create Role Type
 * 
 * Creates a new ecclesiastical label that can be assigned to members.
 * 
 * Business Rules:
 * - Name must be unique (case-insensitive)
 * - Name must be between 2 and 50 characters
 */
@Injectable()
export class CreateRoleTypeUseCase {
  constructor(
    @Inject(ROLE_TYPE_REPOSITORY)
    private readonly roleTypeRepository: IRoleTypeRepository,
  ) {}

  async execute(command: CreateRoleTypeCommand): Promise<RoleType> {
    // Validate and create Value Object
    const name = RoleTypeName.create(command.name);

    // Check for uniqueness
    const exists = await this.roleTypeRepository.existsByName(name.value);
    if (exists) {
      throw new ConflictException(`Role type "${name.value}" already exists`);
    }

    // Create Aggregate
    const roleType = RoleType.create(name);

    // Persist
    return this.roleTypeRepository.save(roleType);
  }
}
