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
import { GdiApplicationService } from '../../application/services/gdi-application.service';
import { CreateGdiDto } from '../dtos/create-gdi.dto';
import { UpdateGdiDto } from '../dtos/update-gdi.dto';
import { GdiResponseDto } from '../dtos/gdi-response.dto';
import { CreateGdiCommand } from '../../application/commands/create-gdi.command';
import { UpdateGdiCommand } from '../../application/commands/update-gdi.command';
import { DeleteGdiCommand } from '../../application/commands/delete-gdi.command';

/**
 * Controller: GDIs
 *
 * HTTP layer - handles requests and delegates to Application Service
 * Converts DTOs to Commands and Domain to Response DTOs
 */
@Controller('gdis')
export class GdisController {
  constructor(
    private readonly gdiApplicationService: GdiApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGdiDto): Promise<GdiResponseDto> {
    const command = new CreateGdiCommand(
      dto.name,
      dto.guideId,
      dto.mentorId,
    );

    const gdi = await this.gdiApplicationService.createGdi(command);

    return GdiResponseDto.fromDomain(gdi);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<GdiResponseDto[]> {
    const gdis = await this.gdiApplicationService.getAllGdis();
    return GdiResponseDto.fromDomainArray(gdis);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GdiResponseDto> {
    const gdi = await this.gdiApplicationService.getGdiById(id);
    return GdiResponseDto.fromDomain(gdi);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGdiDto,
  ): Promise<GdiResponseDto> {
    const command = new UpdateGdiCommand(
      id,
      dto.name,
      dto.guideId,
      dto.mentorId,
    );

    const gdi = await this.gdiApplicationService.updateGdi(command);

    return GdiResponseDto.fromDomain(gdi);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteGdiCommand(id);
    await this.gdiApplicationService.deleteGdi(command);
  }
}
