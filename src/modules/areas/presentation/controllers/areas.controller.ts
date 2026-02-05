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
import { AreaApplicationService } from '../../application/services/area-application.service';
import { CreateAreaDto } from '../dtos/create-area.dto';
import { UpdateAreaDto } from '../dtos/update-area.dto';
import { AreaResponseDto } from '../dtos/area-response.dto';
import { CreateAreaCommand } from '../../application/commands/create-area.command';
import { UpdateAreaCommand } from '../../application/commands/update-area.command';
import { DeleteAreaCommand } from '../../application/commands/delete-area.command';
import { AssignMemberToAreaCommand } from '../../application/commands/assign-member-to-area.command';
import { RemoveMemberFromAreaCommand } from '../../application/commands/remove-member-from-area.command';

@Controller('areas')
export class AreasController {
  constructor(
    private readonly areaApplicationService: AreaApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAreaDto): Promise<AreaResponseDto> {
    const command = new CreateAreaCommand(
      dto.name,
      dto.description,
      dto.leaderId,
      dto.mentorId,
    );
    const area = await this.areaApplicationService.createArea(command);
    return AreaResponseDto.fromDomain(area);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AreaResponseDto[]> {
    const areas = await this.areaApplicationService.getAllAreas();
    return AreaResponseDto.fromDomainArray(areas);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AreaResponseDto> {
    const area = await this.areaApplicationService.getAreaById(id);
    return AreaResponseDto.fromDomain(area);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAreaDto,
  ): Promise<AreaResponseDto> {
    const command = new UpdateAreaCommand(
      id,
      dto.name,
      dto.description,
      dto.leaderId,
      dto.mentorId,
    );
    const area = await this.areaApplicationService.updateArea(command);
    return AreaResponseDto.fromDomain(area);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteAreaCommand(id);
    await this.areaApplicationService.deleteArea(command);
  }

  // ============================================
  // Area Membership Endpoints
  // ============================================

  /**
   * Get all member IDs assigned to an Area
   */
  @Get(':id/members')
  @HttpCode(HttpStatus.OK)
  async getMembers(
    @Param('id', ParseIntPipe) areaId: number,
  ): Promise<{ memberIds: number[] }> {
    const memberIds = await this.areaApplicationService.getAreaMembers(areaId);
    return { memberIds };
  }

  /**
   * Assign a member to an Area
   * Note: Member must belong to a GDI first
   */
  @Post(':id/members/:memberId')
  @HttpCode(HttpStatus.CREATED)
  async assignMember(
    @Param('id', ParseIntPipe) areaId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<{ areaId: number; memberId: number }> {
    const command = new AssignMemberToAreaCommand(areaId, memberId);
    const membership = await this.areaApplicationService.assignMemberToArea(command);
    return {
      areaId: membership.areaId,
      memberId: membership.memberId,
    };
  }

  /**
   * Remove a member from an Area
   */
  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id', ParseIntPipe) areaId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<void> {
    const command = new RemoveMemberFromAreaCommand(areaId, memberId);
    await this.areaApplicationService.removeMemberFromArea(command);
  }
}
