import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';

@Injectable()
export class GetAllAreasUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(): Promise<Area[]> {
    return await this.areaRepository.findAll();
  }
}
