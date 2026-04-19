import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateRoleTypeDto } from '../dtos/create-role-type.dto';
import { UpdateRoleTypeDto } from '../dtos/update-role-type.dto';
import { RoleTypeResponseDto } from '../dtos/role-type-response.dto';
import { CreateRoleTypeUseCase } from '../../application/use-cases/create-role-type/create-role-type.use-case';
import { GetAllRoleTypesUseCase } from '../../application/use-cases/get-all-role-types/get-all-role-types.use-case';
import { DeleteRoleTypeUseCase } from '../../application/use-cases/delete-role-type/delete-role-type.use-case';
import { UpdateRoleTypeUseCase } from '../../application/use-cases/update-role-type/update-role-type.use-case';
import { CreateRoleTypeCommand } from '../../application/commands/create-role-type.command';
import { UpdateRoleTypeCommand } from '../../application/commands/update-role-type.command';

/**
 * Controller: Role Types
 * 
 * Manages ecclesiastical labels (Pastor, Diácono, Anciano, etc.)
 * These are configurable by administrators for each congregation.
 * 
 * Base path: /api/v1/role-types
 */
@Controller('role-types')
export class RoleTypesController {
  constructor(
    private readonly createRoleTypeUseCase: CreateRoleTypeUseCase,
    private readonly getAllRoleTypesUseCase: GetAllRoleTypesUseCase,
    private readonly deleteRoleTypeUseCase: DeleteRoleTypeUseCase,
    private readonly updateRoleTypeUseCase: UpdateRoleTypeUseCase,
  ) {}

  /**
   * GET /role-types
   * List all role types
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RoleTypeResponseDto[]> {
    const roleTypes = await this.getAllRoleTypesUseCase.execute();
    return RoleTypeResponseDto.fromDomainArray(roleTypes);
  }

  /**
   * POST /role-types
   * Create a new role type
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateRoleTypeDto,
  ): Promise<RoleTypeResponseDto> {
    const command = new CreateRoleTypeCommand(dto.name);
    const roleType = await this.createRoleTypeUseCase.execute(command);
    return RoleTypeResponseDto.fromDomain(roleType);
  }

  /**
   * PATCH /role-types/:id
   * Rename an existing role type.
   * All members that have this label assigned will automatically
   * reflect the new name on the next read (FK relationship).
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleTypeDto,
  ): Promise<RoleTypeResponseDto> {
    const command = new UpdateRoleTypeCommand(id, dto.name);
    const roleType = await this.updateRoleTypeUseCase.execute(command);
    return RoleTypeResponseDto.fromDomain(roleType);
  }

  /**
   * DELETE /role-types/:id
   * Delete a role type
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteRoleTypeUseCase.execute(id);
  }
}
