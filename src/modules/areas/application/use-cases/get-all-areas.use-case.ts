import { Injectable } from '@nestjs/common';
import { AreaRepository } from '../../infrastructure/persistence/typeorm/area.repository';
import { Area } from '../../domain/area.entity';

@Injectable()
export class GetAllAreasUseCase {
  constructor(private readonly areaRepository: AreaRepository) {}

  async execute(): Promise<Area[]> {
    return await this.areaRepository.findAll();
  }
}
