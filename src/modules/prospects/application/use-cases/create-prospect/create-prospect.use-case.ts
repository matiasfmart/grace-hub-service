import { Inject, Injectable } from '@nestjs/common';
import {
  IProspectRepository,
  PROSPECT_REPOSITORY,
} from '../../../domain/repositories/prospect.repository.interface';
import { Prospect } from '../../../domain/prospect.aggregate';
import { CreateProspectCommand } from '../../commands/create-prospect.command';

@Injectable()
export class CreateProspectUseCase {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<Prospect> {
    const prospect = Prospect.create(
      command.firstName,
      command.lastName,
      command.visitDate,
      command.contact,
      command.source,
      command.addedBy,
      command.notes,
    );
    return this.prospectRepository.save(prospect);
  }
}
