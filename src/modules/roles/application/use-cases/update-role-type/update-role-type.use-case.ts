import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  IRoleTypeRepository,
  ROLE_TYPE_REPOSITORY,
} from '../../../domain/repositories/role-type.repository.interface';
import { RoleTypeName } from '../../../domain/value-objects/role-type-name.vo';
import { UpdateRoleTypeCommand } from '../../commands/update-role-type.command';
import { RoleType } from '../../../domain/role-type.aggregate';

/**
 * Use Case: Update Role Type
 *
 * Renames an existing ecclesiastical label.
 *
 * Business Rules:
 * - Role type must exist
 * - New name must be unique (case-insensitive), ignoring itself
 * - Name must be between 2 and 50 characters
 *
 * Side effect: Because member_roles stores role_type_id (FK), all members
 * that have this label assigned will automatically reflect the new name
 * on the next read — no additional cascade logic required.
 */
@Injectable()
export class UpdateRoleTypeUseCase {
  constructor(
    @Inject(ROLE_TYPE_REPOSITORY)
    private readonly roleTypeRepository: IRoleTypeRepository,
  ) {}

  async execute(command: UpdateRoleTypeCommand): Promise<RoleType> {
    const roleType = await this.roleTypeRepository.findById(command.id);
    if (!roleType) {
      throw new NotFoundException(`Role type with ID ${command.id} not found`);
    }

    const newName = RoleTypeName.create(command.name);

    // Check uniqueness only if the name actually changed
    if (newName.value.toLowerCase() !== roleType.name.value.toLowerCase()) {
      const exists = await this.roleTypeRepository.existsByName(newName.value);
      if (exists) {
        throw new ConflictException(`Role type "${newName.value}" already exists`);
      }
    }

    roleType.updateName(newName);
    return this.roleTypeRepository.save(roleType);
  }
}
