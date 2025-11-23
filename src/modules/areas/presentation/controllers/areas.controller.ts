import {
  Controller,
  Get,
  Post,
  Put,
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

@Controller('areas')
export class AreasController {
  constructor(
    private readonly areaApplicationService: AreaApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAreaDto): Promise<AreaResponseDto> {
    const command = new CreateAreaCommand(dto.name, dto.description);
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
    const command = new UpdateAreaCommand(id, dto.name, dto.description);
    const area = await this.areaApplicationService.updateArea(command);
    return AreaResponseDto.fromDomain(area);
  }
}
