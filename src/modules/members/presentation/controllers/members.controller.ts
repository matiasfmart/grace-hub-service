import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MemberApplicationService } from '../../application/services/member-application.service';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { GetMembersFilteredDto } from '../dtos/get-members-filtered.dto';
import { MemberResponseDto } from '../dtos/member-response.dto';
import { PaginatedMembersResponseDto } from '../dtos/paginated-members-response.dto';
import { CreateMemberCommand } from '../../application/commands/create-member.command';
import { UpdateMemberCommand } from '../../application/commands/update-member.command';
import { DeleteMemberCommand } from '../../application/commands/delete-member.command';
import { GetMembersFilteredOptions } from '../../application/use-cases/get-members-filtered/get-members-filtered.options';

/**
 * Members Controller (Presentation Layer)
 *
 * Responsibilities:
 * - Handle HTTP requests/responses
 * - Validate DTOs (framework-level validation)
 * - Map DTOs to Commands/Options
 * - Map Domain objects to Response DTOs
 * - Does NOT contain business logic
 */
@Controller('members')
export class MembersController {
  constructor(
    private readonly memberApplicationService: MemberApplicationService,
  ) {}

  /**
   * Get all members (simple, no filters)
   * For backward compatibility
   */
  @Get()
  async findAll(): Promise<MemberResponseDto[]> {
    // Uses Read Model for queries (CQRS pattern)
    const members = await this.memberApplicationService.getAllMembers();
    return members.map(member => MemberResponseDto.fromReadModel(member));
  }

  /**
   * Get members with filters, search, and pagination
   * Server-side filtering for scalability
   */
  @Get('search')
  async findFiltered(
    @Query() queryDto: GetMembersFilteredDto,
  ): Promise<PaginatedMembersResponseDto> {
    const options: GetMembersFilteredOptions = {
      page: queryDto.page,
      pageSize: queryDto.pageSize,
      searchTerm: queryDto.search,
      statusFilters: queryDto.status,
      roleFilters: queryDto.role,
      gdiFilters: queryDto.gdi?.map(String),
      areaFilters: queryDto.area?.map(String),
    };

    const result = await this.memberApplicationService.getMembersFiltered(options);
    return PaginatedMembersResponseDto.fromResult(result);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberResponseDto> {
    // Uses Read Model for queries (CQRS pattern)
    const member = await this.memberApplicationService.getMemberById(id);
    return MemberResponseDto.fromReadModel(member);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<MemberResponseDto> {
    // Map DTO to Command
    const command = new CreateMemberCommand(
      createMemberDto.firstName,
      createMemberDto.lastName,
      createMemberDto.contact,
      createMemberDto.recordStatus,
      createMemberDto.birthDate ? new Date(createMemberDto.birthDate) : undefined,
      createMemberDto.baptismDate ? new Date(createMemberDto.baptismDate) : undefined,
      createMemberDto.joinDate ? new Date(createMemberDto.joinDate) : undefined,
      createMemberDto.bibleStudy,
      createMemberDto.typeBibleStudy,
      createMemberDto.address,
    );

    const member = await this.memberApplicationService.createMember(command);
    return MemberResponseDto.fromDomain(member);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    const command = new UpdateMemberCommand(
      id,
      updateMemberDto.firstName,
      updateMemberDto.lastName,
      updateMemberDto.contact,
      updateMemberDto.recordStatus,
      updateMemberDto.birthDate ? new Date(updateMemberDto.birthDate) : undefined,
      updateMemberDto.baptismDate ? new Date(updateMemberDto.baptismDate) : undefined,
      updateMemberDto.joinDate ? new Date(updateMemberDto.joinDate) : undefined,
      updateMemberDto.bibleStudy,
      updateMemberDto.typeBibleStudy,
      updateMemberDto.address,
    );

    const member = await this.memberApplicationService.updateMember(command);
    return MemberResponseDto.fromDomain(member);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteMemberCommand(id);
    await this.memberApplicationService.deleteMember(command);
  }
}
