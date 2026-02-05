import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaRepository,
  AREA_REPOSITORY,
} from '../../../domain/repositories/area.repository.interface';
import { Area } from '../../../domain/area.aggregate';
import { AreaName } from '../../../domain/value-objects/area-name.vo';
import { UpdateAreaCommand } from '../../commands/update-area.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

@Injectable()
export class UpdateAreaUseCase {
  constructor(
    @Inject(AREA_REPOSITORY)
    private readonly areaRepository: IAreaRepository,
  ) {}

  async execute(command: UpdateAreaCommand): Promise<Area> {
    const area = await this.areaRepository.findById(command.id);
    if (!area) {
      throw new EntityNotFoundException('Area', command.id);
    }

    if (command.name) {
      const newName = AreaName.create(command.name);
      area.updateName(newName);
    }

    if (command.description !== undefined) {
      area.updateDescription(command.description);
    }

    // Update leaders if provided
    if (command.leaderId !== undefined || command.mentorId !== undefined) {
      area.assignLeaders(command.leaderId, command.mentorId);
    }

    const updatedArea = await this.areaRepository.save(area);
    updatedArea.clearEvents();
    return updatedArea;
  }
}
