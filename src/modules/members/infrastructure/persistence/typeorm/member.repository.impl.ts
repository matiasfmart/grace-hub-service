import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberEntity } from './member.typeorm.entity';
import { IMemberRepository } from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';
import { MemberStatus } from '../../../../../core/common/constants/status.constants';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { MemberMapper } from './mappers/member.mapper';

/**
 * TypeORM Implementation of IMemberRepository
 * This class belongs to the Infrastructure layer
 */
@Injectable()
export class MemberRepositoryImpl
  extends BaseRepository<MemberEntity>
  implements IMemberRepository
{
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    dataSource: DataSource,
  ) {
    super(memberRepository, dataSource);
  }

  async save(member: Member): Promise<Member> {
    const entity = MemberMapper.toPersistence(member);
    const savedEntity = await this.memberRepository.save(entity);
    return MemberMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Member | null> {
    const entity = await this.memberRepository.findOne({
      where: { memberId: id },
    });

    return entity ? MemberMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Member[]> {
    const entities = await this.memberRepository.find();
    return MemberMapper.toDomainArray(entities);
  }

  async findByStatus(status: MemberStatus): Promise<Member[]> {
    const entities = await this.memberRepository.find({
      where: { status: status },
    });
    return MemberMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.memberRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.memberRepository.count({
      where: { memberId: id },
    });
    return count > 0;
  }

  /**
   * Example using stored procedure
   */
  async findAllWithStoredProcedure(): Promise<Member[]> {
    const result = await this.executeStoredProcedure<any[]>('sp_get_all_members');
    // Map raw results to domain entities
    const entities: MemberEntity[] = result.map(raw => Object.assign(new MemberEntity(), raw));
    return MemberMapper.toDomainArray(entities);
  }
}
