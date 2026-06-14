import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IProspectRepository,
  PROSPECT_REPOSITORY,
} from '../../../domain/repositories/prospect.repository.interface';
import { Prospect } from '../../../domain/prospect.aggregate';
import { IntegrateProspectCommand } from '../../commands/integrate-prospect.command';
import { MemberApplicationService } from '../../../../members/application/services/member-application.service';
import { GdiApplicationService } from '../../../../gdis/application/services/gdi-application.service';
import { CreateMemberCommand } from '../../../../members/application/commands/create-member.command';
import { AssignMemberToGdiCommand } from '../../../../gdis/application/commands/assign-member-to-gdi.command';
import { RecordStatus } from '../../../../../core/common/constants/status.constants';

@Injectable()
export class IntegrateProspectUseCase {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    private readonly memberApplicationService: MemberApplicationService,
    private readonly gdiApplicationService: GdiApplicationService,
  ) {}

  async execute(command: IntegrateProspectCommand): Promise<Prospect> {
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      throw new NotFoundException(`Prospecto con ID ${command.prospectId} no encontrado`);
    }

    // Create the member (visitAt → joinDate, as defined in the proposal)
    const createCommand = new CreateMemberCommand(
      prospect.firstName,
      prospect.lastName,
      prospect.contact,
      RecordStatus.VIGENTE,
      undefined,
      undefined,
      prospect.visitAt,
      false,
    );
    const newMember = await this.memberApplicationService.createMember(createCommand);

    // Assign to GDI if specified
    if (command.gdiId && newMember.id !== undefined) {
      await this.gdiApplicationService.assignMemberToGdi(
        new AssignMemberToGdiCommand(command.gdiId, newMember.id),
      );
    }

    // Domain operation: validates business rules, changes status + memberId
    prospect.integrate(newMember.id!);

    // Persist the state change
    return this.prospectRepository.update(prospect.id!, {
      status: prospect.status,
      memberId: prospect.memberId,
    });
  }
}
