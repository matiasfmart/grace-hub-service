import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';

/**
 * Use Case: Get All Members
 */
@Injectable()
export class GetAllMembersUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(): Promise<Member[]> {
    return await this.memberRepository.findAll();
  }
}
