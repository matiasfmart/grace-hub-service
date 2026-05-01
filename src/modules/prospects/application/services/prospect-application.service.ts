import { Injectable } from '@nestjs/common';
import { CreateProspectUseCase } from '../use-cases/create-prospect/create-prospect.use-case';
import { GetProspectsFilteredUseCase } from '../use-cases/get-prospects-filtered/get-prospects-filtered.use-case';
import { IntegrateProspectUseCase } from '../use-cases/integrate-prospect/integrate-prospect.use-case';
import { ArchiveProspectUseCase } from '../use-cases/archive-prospect/archive-prospect.use-case';
import { UpdateProspectFieldsUseCase, UpdateProspectFieldsInput } from '../use-cases/update-prospect-fields/update-prospect-fields.use-case';
import { CreateProspectCommand } from '../commands/create-prospect.command';
import { IntegrateProspectCommand } from '../commands/integrate-prospect.command';
import { GetProspectsFilteredOptions } from '../use-cases/get-prospects-filtered/get-prospects-filtered.options';
import { Prospect } from '../../domain/prospect.aggregate';
import { IProspectRepository, PROSPECT_REPOSITORY } from '../../domain/repositories/prospect.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class ProspectApplicationService {
  constructor(
    private readonly createProspectUseCase: CreateProspectUseCase,
    private readonly getProspectsFilteredUseCase: GetProspectsFilteredUseCase,
    private readonly integrateProspectUseCase: IntegrateProspectUseCase,
    private readonly archiveProspectUseCase: ArchiveProspectUseCase,
    private readonly updateProspectFieldsUseCase: UpdateProspectFieldsUseCase,
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async createProspect(command: CreateProspectCommand): Promise<Prospect> {
    return this.createProspectUseCase.execute(command);
  }

  async getProspects(options: GetProspectsFilteredOptions): Promise<Prospect[]> {
    return this.getProspectsFilteredUseCase.execute(options);
  }

  async countPending(): Promise<number> {
    return this.prospectRepository.countPending();
  }

  async integrateProspect(command: IntegrateProspectCommand): Promise<Prospect> {
    return this.integrateProspectUseCase.execute(command);
  }

  async archiveProspect(prospectId: number): Promise<Prospect> {
    return this.archiveProspectUseCase.execute(prospectId);
  }

  async getProspectById(id: number): Promise<Prospect | null> {
    return this.prospectRepository.findById(id);
  }

  async updateProspectFields(id: number, input: UpdateProspectFieldsInput): Promise<Prospect> {
    return this.updateProspectFieldsUseCase.execute(id, input);
  }
}
