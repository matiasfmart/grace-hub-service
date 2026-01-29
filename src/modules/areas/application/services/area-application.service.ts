import { Injectable } from '@nestjs/common';
import { CreateAreaUseCase } from '../use-cases/create-area/create-area.use-case';
import { GetAllAreasUseCase } from '../use-cases/get-area/get-all-areas.use-case';
import { GetAreaByIdUseCase } from '../use-cases/get-area/get-area-by-id.use-case';
import { UpdateAreaUseCase } from '../use-cases/update-area/update-area.use-case';
import { DeleteAreaUseCase } from '../use-cases/delete-area/delete-area.use-case';
import { CreateAreaCommand } from '../commands/create-area.command';
import { UpdateAreaCommand } from '../commands/update-area.command';
import { DeleteAreaCommand } from '../commands/delete-area.command';
import { Area } from '../../domain/area.aggregate';

@Injectable()
export class AreaApplicationService {
  constructor(
    private readonly createAreaUseCase: CreateAreaUseCase,
    private readonly getAllAreasUseCase: GetAllAreasUseCase,
    private readonly getAreaByIdUseCase: GetAreaByIdUseCase,
    private readonly updateAreaUseCase: UpdateAreaUseCase,
    private readonly deleteAreaUseCase: DeleteAreaUseCase,
  ) {}

  async createArea(command: CreateAreaCommand): Promise<Area> {
    return await this.createAreaUseCase.execute(command);
  }

  async getAllAreas(): Promise<Area[]> {
    return await this.getAllAreasUseCase.execute();
  }

  async getAreaById(id: number): Promise<Area> {
    return await this.getAreaByIdUseCase.execute(id);
  }

  async updateArea(command: UpdateAreaCommand): Promise<Area> {
    return await this.updateAreaUseCase.execute(command);
  }

  async deleteArea(command: DeleteAreaCommand): Promise<void> {
    return await this.deleteAreaUseCase.execute(command);
  }
}
