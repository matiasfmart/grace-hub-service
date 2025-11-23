import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

@Injectable()
export class GetAreaByIdUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(id: number): Promise<Area> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new EntityNotFoundException('Area', id);
    }
    return area;
  }
}
