import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('meetings')
export class MeetingsController {
  @Get()
  async findAll() {
    // TODO: Implementar GetAllMeetingsUseCase
    return { message: 'Get all meetings' };
  }

  @Get('series')
  async findAllSeries() {
    // TODO: Implementar GetAllMeetingSeriesUseCase
    return { message: 'Get all meeting series' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implementar GetMeetingByIdUseCase
    return { message: `Get meeting ${id}` };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeetingDto: any) {
    // TODO: Implementar CreateMeetingUseCase
    return { message: 'Create meeting', data: createMeetingDto };
  }

  @Post('series')
  @HttpCode(HttpStatus.CREATED)
  async createSeries(@Body() createSeriesDto: any) {
    // TODO: Implementar CreateMeetingSeriesUseCase con generación automática de instancias
    return { message: 'Create meeting series', data: createSeriesDto };
  }
}
