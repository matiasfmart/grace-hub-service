import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BatchUpsertTithesUseCase } from './application/use-cases/batch-upsert-tithes.use-case';
import { BatchUpsertTitheDto } from './application/dtos/batch-upsert-tithe.dto';

@Controller('tithes')
export class TithesController {
  constructor(
    private readonly batchUpsertTithesUseCase: BatchUpsertTithesUseCase,
  ) {}

  @Get()
  async findAll(@Query('year') year?: number, @Query('month') month?: number) {
    // TODO: Implementar GetAllTithesUseCase
    return { message: 'Get all tithes', year, month };
  }

  @Get('member/:memberId')
  async findByMember(@Param('memberId') memberId: string) {
    // TODO: Implementar GetTithesByMemberUseCase
    return { message: `Get tithes for member ${memberId}` };
  }

  @Post('batch-upsert')
  @HttpCode(HttpStatus.OK)
  async batchUpsert(@Body() batchUpsertDto: BatchUpsertTitheDto) {
    return await this.batchUpsertTithesUseCase.execute(batchUpsertDto);
  }
}
