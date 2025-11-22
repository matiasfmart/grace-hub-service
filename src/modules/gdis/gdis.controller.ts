import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GetAllGdisUseCase } from './application/use-cases/get-all-gdis.use-case';
import { CreateGdiDto } from './application/dtos/create-gdi.dto';
import { UpdateGdiDto } from './application/dtos/update-gdi.dto';

@Controller('gdis')
export class GdisController {
  constructor(
    private readonly getAllGdisUseCase: GetAllGdisUseCase,
  ) {}

  @Get()
  async findAll() {
    return await this.getAllGdisUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implementar GetGdiByIdUseCase
    return { message: `Get GDI ${id}` };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGdiDto: CreateGdiDto) {
    // TODO: Implementar CreateGdiUseCase
    return { message: 'Create GDI', data: createGdiDto };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGdiDto: UpdateGdiDto) {
    // TODO: Implementar UpdateGdiUseCase
    return { message: `Update GDI ${id}`, data: updateGdiDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    // TODO: Implementar DeleteGdiUseCase
    return;
  }
}
