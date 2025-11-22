import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberEntity } from './member.typeorm.entity';
import { IMemberRepository } from '../../../domain/member.repository.interface';
import { Member } from '../../../domain/member.entity';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';

@Injectable()
export class MemberRepository extends BaseRepository<MemberEntity> implements IMemberRepository {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    dataSource: DataSource,
  ) {
    super(memberRepository, dataSource);
  }

  async findAll(): Promise<Member[]> {
    // Puedes usar stored procedure o query directo
    return await this.memberRepository.find();
  }

  async findById(id: number): Promise<Member | null> {
    return await this.memberRepository.findOne({ where: { memberId: id } });
  }

  async create(member: Partial<Member>): Promise<Member> {
    const newMember = this.memberRepository.create(member);
    return await this.memberRepository.save(newMember);
  }

  async update(id: number, member: Partial<Member>): Promise<Member> {
    await this.memberRepository.update(id, member);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.memberRepository.delete(id);
  }

  async findByStatus(status: string): Promise<Member[]> {
    return await this.memberRepository.find({ where: { status: status as any } });
  }

  // Ejemplo de uso de stored procedure
  async findAllWithStoredProcedure(): Promise<Member[]> {
    return await this.executeStoredProcedure<Member[]>('sp_get_all_members');
  }
}
