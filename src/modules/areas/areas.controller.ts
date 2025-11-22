import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GetAllAreasUseCase } from './application/use-cases/get-all-areas.use-case';
import { CreateAreaDto } from './application/dtos/create-area.dto';
import { UpdateAreaDto } from './application/dtos/update-area.dto';

@Controller('areas')
export class AreasController {
  constructor(
    private readonly getAllAreasUseCase: GetAllAreasUseCase,
  ) {}

  @Get()
  async findAll() {
    return await this.getAllAreasUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implementar GetAreaByIdUseCase
    return { message: `Get Area ${id}` };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAreaDto: CreateAreaDto) {
    // TODO: Implementar CreateAreaUseCase
    return { message: 'Create Area', data: createAreaDto };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    // TODO: Implementar UpdateAreaUseCase
    return { message: `Update Area ${id}`, data: updateAreaDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    // TODO: Implementar DeleteAreaUseCase
    return;
  }
}
