import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/persistence/typeorm/member.repository';
import { Member } from '../../domain/member.entity';

@Injectable()
export class GetAllMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(): Promise<Member[]> {
    return await this.memberRepository.findAll();
  }
}
