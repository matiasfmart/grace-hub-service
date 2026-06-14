import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MemberCount,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';

@Injectable()
export class GetMemberCountUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(): Promise<MemberCount> {
    return this.memberRepository.countActive();
  }
}
