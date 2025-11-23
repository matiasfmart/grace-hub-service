import { Inject, Injectable } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';
import { CreateTitheCommand } from '../../commands/create-tithe.command';

@Injectable()
export class CreateTitheUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(command: CreateTitheCommand): Promise<Tithe> {
    const tithe = Tithe.create(
      command.memberId,
      command.year,
      command.month,
    );
    const savedTithe = await this.titheRepository.save(tithe);
    savedTithe.clearEvents();
    return savedTithe;
  }
}
