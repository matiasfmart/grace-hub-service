import { Injectable } from '@nestjs/common';
import { CreateTitheUseCase } from '../use-cases/create-tithe/create-tithe.use-case';
import { GetAllTithesUseCase } from '../use-cases/get-tithe/get-all-tithes.use-case';
import { CreateTitheCommand } from '../commands/create-tithe.command';
import { Tithe } from '../../domain/tithe.aggregate';

@Injectable()
export class TitheApplicationService {
  constructor(
    private readonly createTitheUseCase: CreateTitheUseCase,
    private readonly getAllTithesUseCase: GetAllTithesUseCase,
  ) {}

  async createTithe(command: CreateTitheCommand): Promise<Tithe> {
    return await this.createTitheUseCase.execute(command);
  }

  async getAllTithes(): Promise<Tithe[]> {
    return await this.getAllTithesUseCase.execute();
  }
}
