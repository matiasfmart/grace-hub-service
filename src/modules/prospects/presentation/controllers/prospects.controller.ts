import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ProspectApplicationService } from '../../application/services/prospect-application.service';
import { CreateProspectDto } from '../dtos/create-prospect.dto';
import { IntegrateProspectDto } from '../dtos/integrate-prospect.dto';
import { UpdateProspectFieldsDto } from '../dtos/update-prospect-fields.dto';
import { GetProspectsFilteredDto } from '../dtos/get-prospects-filtered.dto';
import { ProspectResponseDto, PendingCountResponseDto } from '../dtos/prospect-response.dto';
import { CreateProspectCommand } from '../../application/commands/create-prospect.command';
import { IntegrateProspectCommand } from '../../application/commands/integrate-prospect.command';
import { GetProspectsFilteredOptions } from '../../application/use-cases/get-prospects-filtered/get-prospects-filtered.options';
import { ProspectSource } from '../../domain/prospect.aggregate';

@Controller('prospects')
export class ProspectsController {
  constructor(
    private readonly prospectApplicationService: ProspectApplicationService,
  ) {}

  /**
   * POST /prospects — Register a new visitor
   * Used by the welcome team (admin or future PWA)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProspectDto): Promise<ProspectResponseDto> {
    const command = new CreateProspectCommand(
      dto.firstName,
      dto.lastName,
      new Date(dto.visitDate),
      dto.contact,
      dto.source ?? ProspectSource.MANUAL,
      dto.addedBy,
      dto.notes,
      dto.meetingSeriesId,
    );
    const prospect = await this.prospectApplicationService.createProspect(command);
    return ProspectResponseDto.fromDomain(prospect);
  }

  /**
   * GET /prospects/count/pending — Count pending prospects
   * Used by the dashboard badge
   * Must be declared BEFORE /:id to avoid routing conflicts
   */
  @Get('count/pending')
  async countPending(): Promise<PendingCountResponseDto> {
    const count = await this.prospectApplicationService.countPending();
    return new PendingCountResponseDto(count);
  }

  /**
   * GET /prospects?status=pending|integrated|lost — Get prospects filtered by status
   */
  @Get()
  async findFiltered(@Query() dto: GetProspectsFilteredDto): Promise<ProspectResponseDto[]> {
    const options: GetProspectsFilteredOptions = { status: dto.status };
    const prospects = await this.prospectApplicationService.getProspects(options);
    return prospects.map(ProspectResponseDto.fromDomain);
  }

  /**
   * PATCH /prospects/:id/integrate — Integrate a prospect as a member
   */
  @Patch(':id/integrate')
  async integrate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IntegrateProspectDto,
  ): Promise<ProspectResponseDto> {
    const command = new IntegrateProspectCommand(id, dto.gdiId);
    const prospect = await this.prospectApplicationService.integrateProspect(command);
    return ProspectResponseDto.fromDomain(prospect);
  }

  /**
   * PATCH /prospects/:id/archive — Archive a prospect
   */
  @Patch(':id/archive')
  async archive(@Param('id', ParseIntPipe) id: number): Promise<ProspectResponseDto> {
    const prospect = await this.prospectApplicationService.archiveProspect(id);
    return ProspectResponseDto.fromDomain(prospect);
  }

  /**
   * GET /prospects/:id — Get a single prospect by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProspectResponseDto> {
    const prospect = await this.prospectApplicationService.getProspectById(id);
    if (!prospect) throw new NotFoundException(`Prospect ${id} not found`);
    return ProspectResponseDto.fromDomain(prospect);
  }

  /**
   * PATCH /prospects/:id — Update editable fields of a pending prospect
   * Only allowed when status = 'pending'. Editable: firstName, lastName, contact, notes, visitDate.
   * RN-PWA-3, RN-PWA-4.
   */
  @Patch(':id')
  async updateFields(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProspectFieldsDto,
  ): Promise<ProspectResponseDto> {
    const prospect = await this.prospectApplicationService.updateProspectFields(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      contact: dto.contact,
      notes: dto.notes,
      visitDate: dto.visitDate,
      meetingSeriesId: dto.meetingSeriesId,
    });
    return ProspectResponseDto.fromDomain(prospect);
  }
}
