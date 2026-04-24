import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { AreaWithStats } from '../../../domain/read-models/area-with-stats.read-model';

@Injectable()
export class GetAllAreasUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(): Promise<AreaWithStats[]> {
    return await this.areaRepository.findAllWithStats();
  }
}
