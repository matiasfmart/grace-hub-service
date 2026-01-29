import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TitheApplicationService } from '../../application/services/tithe-application.service';
import { CreateTitheDto } from '../dtos/create-tithe.dto';
import { BatchUpsertTithesDto } from '../dtos/batch-upsert-tithes.dto';
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
  async findAll(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ): Promise<TitheResponseDto[]> {
    // If both year and month are provided, filter by them
    if (year && month) {
      const tithes = await this.titheApplicationService.getTithesByYearAndMonth(
        parseInt(year, 10),
        parseInt(month, 10),
      );
      return TitheResponseDto.fromDomainArray(tithes);
    }

    // Otherwise return all
    const tithes = await this.titheApplicationService.getAllTithes();
    return TitheResponseDto.fromDomainArray(tithes);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  async batchUpsert(
    @Body() dto: BatchUpsertTithesDto,
  ): Promise<{ created: number; deleted: number }> {
    return await this.titheApplicationService.batchUpsertTithes(dto.items);
  }
}
