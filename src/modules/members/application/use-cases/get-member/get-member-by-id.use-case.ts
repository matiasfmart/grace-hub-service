import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Get Member by ID
 */
@Injectable()
export class GetMemberByIdUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new EntityNotFoundException('Member', memberId);
    }

    return member;
  }
}
