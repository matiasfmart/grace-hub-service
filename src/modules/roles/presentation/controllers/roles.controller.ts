import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { RoleApplicationService } from '../../application/services/role-application.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';
import { CreateRoleCommand } from '../../application/commands/create-role.command';
import { UpdateRoleCommand } from '../../application/commands/update-role.command';
import { DeleteRoleCommand } from '../../application/commands/delete-role.command';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly roleApplicationService: RoleApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    const command = new CreateRoleCommand(
      dto.memberId,
      dto.roleGeneral,
    );
    const role = await this.roleApplicationService.createRole(command);
    return RoleResponseDto.fromDomain(role);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleApplicationService.getAllRoles();
    return RoleResponseDto.fromDomainArray(roles);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoleResponseDto> {
    const role = await this.roleApplicationService.getRoleById(id);
    return RoleResponseDto.fromDomain(role);
  }

  @Get('member/:memberId')
  @HttpCode(HttpStatus.OK)
  async findByMember(
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<RoleResponseDto[]> {
    const roles = await this.roleApplicationService.getRolesByMember(memberId);
    return RoleResponseDto.fromDomainArray(roles);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const command = new UpdateRoleCommand(
      id,
      dto.roleGeneral,
    );
    const role = await this.roleApplicationService.updateRole(command);
    return RoleResponseDto.fromDomain(role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteRoleCommand(id);
    await this.roleApplicationService.deleteRole(command);
  }
}
