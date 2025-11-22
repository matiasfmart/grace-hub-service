import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/persistence/typeorm/member.repository';
import { Member } from '../../domain/member.entity';
import { CreateMemberDto } from '../dtos/create-member.dto';

@Injectable()
export class CreateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(dto: CreateMemberDto): Promise<Member> {
    // Transformar DTO a formato de entidad
    const memberData: Partial<Member> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      contact: dto.contact,
      status: dto.status,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      baptismDate: dto.baptismDate ? new Date(dto.baptismDate) : undefined,
      joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
      bibleStudy: dto.bibleStudy ?? false,
      typeBibleStudy: dto.typeBibleStudy,
    };

    return await this.memberRepository.create(memberData);
  }
}
