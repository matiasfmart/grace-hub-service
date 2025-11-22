import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GetAllMembersUseCase } from './application/use-cases/get-all-members.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { CreateMemberDto } from './application/dtos/create-member.dto';
import { UpdateMemberDto } from './application/dtos/update-member.dto';

@Controller('members')
export class MembersController {
  constructor(
    private readonly getAllMembersUseCase: GetAllMembersUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
  ) {}

  @Get()
  async findAll() {
    return await this.getAllMembersUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implementar GetMemberByIdUseCase
    return { message: `Get member ${id}` };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.createMemberUseCase.execute(createMemberDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    // TODO: Implementar UpdateMemberUseCase
    return { message: `Update member ${id}`, data: updateMemberDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    // TODO: Implementar DeleteMemberUseCase
    return;
  }
}
