import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TitheApplicationService } from '../../application/services/tithe-application.service';
import { CreateTitheDto } from '../dtos/create-tithe.dto';
import { TitheResponseDto } from '../dtos/tithe-response.dto';
import { CreateTitheCommand } from '../../application/commands/create-tithe.command';

@Controller('tithes')
export class TithesController {
  constructor(
    private readonly titheApplicationService: TitheApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTitheDto): Promise<TitheResponseDto> {
    const command = new CreateTitheCommand(
      dto.memberId,
      dto.year,
      dto.month,
    );
    const tithe = await this.titheApplicationService.createTithe(command);
    return TitheResponseDto.fromDomain(tithe);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TitheResponseDto[]> {
    const tithes = await this.titheApplicationService.getAllTithes();
    return TitheResponseDto.fromDomainArray(tithes);
  }
}
