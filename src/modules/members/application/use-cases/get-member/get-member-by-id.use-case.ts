import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { MemberWithAssignmentsReadModel } from '../../../domain/read-models/member-with-assignments.read-model';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Get Member by ID with Assignments
 * Returns a member with their GDI, Areas, and Roles assignments
 * Uses Read Model for optimized querying (CQRS pattern)
 */
@Injectable()
export class GetMemberByIdUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(memberId: number): Promise<MemberWithAssignmentsReadModel> {
    const member = await this.memberRepository.findByIdWithAssignments(memberId);

    if (!member) {
      throw new EntityNotFoundException('Member', memberId);
    }

    return member;
  }
}
