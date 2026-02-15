import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { MemberWithAssignmentsReadModel } from '../../../domain/read-models/member-with-assignments.read-model';

/**
 * Use Case: Get All Members with Assignments
 * Returns all members with their GDI, Areas, and Roles assignments
 * Uses Read Model for optimized querying (CQRS pattern)
 */
@Injectable()
export class GetAllMembersUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(): Promise<MemberWithAssignmentsReadModel[]> {
    return await this.memberRepository.findAllWithAssignments();
  }
}
