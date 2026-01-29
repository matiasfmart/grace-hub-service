import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { DeleteMemberCommand } from '../../commands/delete-member.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Delete Member
 *
 * Application layer - orchestrates domain operations
 * Validates existence before deletion
 */
@Injectable()
export class DeleteMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: DeleteMemberCommand): Promise<void> {
    // Verify member exists
    const exists = await this.memberRepository.exists(command.memberId);

    if (!exists) {
      throw new EntityNotFoundException('Member', command.memberId);
    }

    // Delete member
    await this.memberRepository.delete(command.memberId);
  }
}
