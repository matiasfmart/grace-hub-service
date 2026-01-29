import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MemberApplicationService } from '../../application/services/member-application.service';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberResponseDto } from '../dtos/member-response.dto';
import { CreateMemberCommand } from '../../application/commands/create-member.command';
import { UpdateMemberCommand } from '../../application/commands/update-member.command';
import { DeleteMemberCommand } from '../../application/commands/delete-member.command';

/**
 * Members Controller (Presentation Layer)
 *
 * Responsibilities:
 * - Handle HTTP requests/responses
 * - Validate DTOs (framework-level validation)
 * - Map DTOs to Commands
 * - Map Domain objects to Response DTOs
 * - Does NOT contain business logic
 */
@Controller('members')
export class MembersController {
  constructor(
    private readonly memberApplicationService: MemberApplicationService,
  ) {}

  @Get()
  async findAll(): Promise<MemberResponseDto[]> {
    const members = await this.memberApplicationService.getAllMembers();
    return members.map(member => MemberResponseDto.fromDomain(member));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberResponseDto> {
    const member = await this.memberApplicationService.getMemberById(id);
    return MemberResponseDto.fromDomain(member);
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
      createMemberDto.status,
      createMemberDto.birthDate ? new Date(createMemberDto.birthDate) : undefined,
      createMemberDto.baptismDate ? new Date(createMemberDto.baptismDate) : undefined,
      createMemberDto.joinDate ? new Date(createMemberDto.joinDate) : undefined,
      createMemberDto.bibleStudy,
      createMemberDto.typeBibleStudy,
    );

    const member = await this.memberApplicationService.createMember(command);
    return MemberResponseDto.fromDomain(member);
  }

  @Put(':id')
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
      updateMemberDto.status,
      updateMemberDto.birthDate ? new Date(updateMemberDto.birthDate) : undefined,
      updateMemberDto.baptismDate ? new Date(updateMemberDto.baptismDate) : undefined,
      updateMemberDto.joinDate ? new Date(updateMemberDto.joinDate) : undefined,
      updateMemberDto.bibleStudy,
      updateMemberDto.typeBibleStudy,
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
