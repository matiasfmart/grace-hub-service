import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MemberRoleSummary,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';

@Injectable()
export class GetMemberRoleSummaryUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(): Promise<MemberRoleSummary> {
    return this.memberRepository.getRoleSummary();
  }
}
