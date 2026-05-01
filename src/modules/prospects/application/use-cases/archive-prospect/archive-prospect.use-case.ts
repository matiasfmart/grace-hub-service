import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IProspectRepository,
  PROSPECT_REPOSITORY,
} from '../../../domain/repositories/prospect.repository.interface';
import { Prospect } from '../../../domain/prospect.aggregate';

@Injectable()
export class ArchiveProspectUseCase {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(prospectId: number): Promise<Prospect> {
    const prospect = await this.prospectRepository.findById(prospectId);
    if (!prospect) {
      throw new NotFoundException(`Prospecto con ID ${prospectId} no encontrado`);
    }

    // Domain operation: validates business rules, changes status
    prospect.archive();

    return this.prospectRepository.update(prospect.id!, { status: prospect.status });
  }
}
