import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';
import { AreaName } from '../../../domain/value-objects/area-name.vo';
import { CreateAreaCommand } from '../../commands/create-area.command';

@Injectable()
export class CreateAreaUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(command: CreateAreaCommand): Promise<Area> {
    const name = AreaName.create(command.name);
    const area = Area.create(name, command.description);
    const savedArea = await this.areaRepository.save(area);
    savedArea.clearEvents();
    return savedArea;
  }
}
