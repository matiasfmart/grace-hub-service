import { Injectable } from '@nestjs/common';
import { CreateMemberUseCase } from '../use-cases/create-member/create-member.use-case';
import { GetAllMembersUseCase } from '../use-cases/get-member/get-all-members.use-case';
import { GetMemberByIdUseCase } from '../use-cases/get-member/get-member-by-id.use-case';
import { GetMembersFilteredUseCase } from '../use-cases/get-members-filtered/get-members-filtered.use-case';
import { GetMembersFilteredOptions } from '../use-cases/get-members-filtered/get-members-filtered.options';
import { UpdateMemberUseCase } from '../use-cases/update-member/update-member.use-case';
import { DeleteMemberUseCase } from '../use-cases/delete-member/delete-member.use-case';
import { CreateMemberCommand } from '../commands/create-member.command';
import { UpdateMemberCommand } from '../commands/update-member.command';
import { DeleteMemberCommand } from '../commands/delete-member.command';
import { Member } from '../../domain/member.aggregate';
import { MemberWithAssignmentsReadModel } from '../../domain/read-models/member-with-assignments.read-model';
import { PaginatedMembersResult } from '../../domain/read-models/member-query.types';

/**
 * Application Service for Member module
 *
 * Responsibilities:
 * - Orchestrates use cases
 * - Handles transactions
 * - Manages application flow
 * - Does NOT contain business logic (that's in Use Cases and Domain)
 * 
 * Note: Query operations return Read Models (CQRS pattern)
 *       Command operations return Aggregates
 */
@Injectable()
export class MemberApplicationService {
  constructor(
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly getAllMembersUseCase: GetAllMembersUseCase,
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
    private readonly getMembersFilteredUseCase: GetMembersFilteredUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly deleteMemberUseCase: DeleteMemberUseCase,
  ) {}

  // Command operations (return Aggregate)
  async createMember(command: CreateMemberCommand): Promise<Member> {
    return await this.createMemberUseCase.execute(command);
  }

  async updateMember(command: UpdateMemberCommand): Promise<Member> {
    return await this.updateMemberUseCase.execute(command);
  }

  async deleteMember(command: DeleteMemberCommand): Promise<void> {
    return await this.deleteMemberUseCase.execute(command);
  }

  // Query operations (return Read Model)
  async getMemberById(id: number): Promise<MemberWithAssignmentsReadModel> {
    return await this.getMemberByIdUseCase.execute(id);
  }

  async getAllMembers(): Promise<MemberWithAssignmentsReadModel[]> {
    return await this.getAllMembersUseCase.execute();
  }

  async getMembersFiltered(
    options: GetMembersFilteredOptions
  ): Promise<PaginatedMembersResult<MemberWithAssignmentsReadModel>> {
    return await this.getMembersFilteredUseCase.execute(options);
  }
}
