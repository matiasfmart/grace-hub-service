import { Inject, Injectable } from '@nestjs/common';
import {
  IProspectRepository,
  PROSPECT_REPOSITORY,
} from '../../../domain/repositories/prospect.repository.interface';
import { Prospect } from '../../../domain/prospect.aggregate';
import { GetProspectsFilteredOptions } from './get-prospects-filtered.options';

@Injectable()
export class GetProspectsFilteredUseCase {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(options: GetProspectsFilteredOptions): Promise<Prospect[]> {
    return this.prospectRepository.findFiltered(options);
  }
}
