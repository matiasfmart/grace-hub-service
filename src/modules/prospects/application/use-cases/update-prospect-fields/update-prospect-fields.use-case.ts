import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IProspectRepository, PROSPECT_REPOSITORY } from '../../../domain/repositories/prospect.repository.interface';
import { Prospect, ProspectStatus } from '../../../domain/prospect.aggregate';
import { BusinessRuleViolationException } from '../../../../../core/domain/exceptions/domain.exception';

export interface UpdateProspectFieldsInput {
  firstName?: string;
  lastName?: string;
  contact?: string;
  notes?: string;
  visitDate?: string; // ISO 8601 datetime string
  meetingSeriesId?: number;
}

@Injectable()
export class UpdateProspectFieldsUseCase {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(id: number, input: UpdateProspectFieldsInput): Promise<Prospect> {
    const prospect = await this.prospectRepository.findById(id);
    if (!prospect) throw new NotFoundException(`Prospect ${id} not found`);

    if (prospect.status !== ProspectStatus.PENDING) {
      throw new BusinessRuleViolationException(
        `Solo se pueden editar prospectos en estado 'pending'. Estado actual: '${prospect.status}'`,
      );
    }

    return this.prospectRepository.updateFields(id, {
      firstName: input.firstName,
      lastName: input.lastName,
      contact: input.contact,
      notes: input.notes,
      visitAt: input.visitDate ? new Date(input.visitDate) : undefined,
      meetingSeriesId: input.meetingSeriesId,
    });
  }
}
