import { Injectable } from '@nestjs/common';
import { CreateMemberUseCase } from '../use-cases/create-member/create-member.use-case';
import { GetAllMembersUseCase } from '../use-cases/get-member/get-all-members.use-case';
import { GetMemberByIdUseCase } from '../use-cases/get-member/get-member-by-id.use-case';
import { CreateMemberCommand } from '../commands/create-member.command';
import { Member } from '../../domain/member.aggregate';

/**
 * Application Service for Member module
 *
 * Responsibilities:
 * - Orchestrates use cases
 * - Handles transactions
 * - Manages application flow
 * - Does NOT contain business logic (that's in Use Cases and Domain)
 */
@Injectable()
export class MemberApplicationService {
  constructor(
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly getAllMembersUseCase: GetAllMembersUseCase,
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
  ) {}

  async createMember(command: CreateMemberCommand): Promise<Member> {
    return await this.createMemberUseCase.execute(command);
  }

  async getMemberById(id: number): Promise<Member> {
    return await this.getMemberByIdUseCase.execute(id);
  }

  async getAllMembers(): Promise<Member[]> {
    return await this.getAllMembersUseCase.execute();
  }

  // Future: Complex workflows can be orchestrated here
  // async registerMemberWithRoles(command: RegisterMemberCommand): Promise<Member> {
  //   // 1. Create member
  //   const member = await this.createMemberUseCase.execute(...);
  //   // 2. Assign to GDI
  //   await this.assignToGdiUseCase.execute(...);
  //   // 3. Calculate roles
  //   await this.calculateRolesUseCase.execute(...);
  //   return member;
  // }
}
