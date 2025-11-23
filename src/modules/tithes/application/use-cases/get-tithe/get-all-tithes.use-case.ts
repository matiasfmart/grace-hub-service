import { Inject, Injectable } from '@nestjs/common';
import {
  ITitheRepository,
  TITHE_REPOSITORY,
} from '../../../domain/repositories/tithe.repository.interface';
import { Tithe } from '../../../domain/tithe.aggregate';

@Injectable()
export class GetAllTithesUseCase {
  constructor(
    @Inject(TITHE_REPOSITORY)
    private readonly titheRepository: ITitheRepository,
  ) {}

  async execute(): Promise<Tithe[]> {
    return await this.titheRepository.findAll();
  }
}
