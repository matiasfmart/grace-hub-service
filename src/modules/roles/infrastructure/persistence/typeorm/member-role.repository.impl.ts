import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberRoleEntity } from './member-role.typeorm.entity';
import { IMemberRoleRepository } from '../../../domain/repositories/member-role.repository.interface';
import { MemberRole } from '../../../domain/member-role.aggregate';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { MemberRoleMapper } from './mappers/member-role.mapper';

@Injectable()
export class MemberRoleRepositoryImpl
  extends BaseRepository<MemberRoleEntity>
  implements IMemberRoleRepository
{
  constructor(
    @InjectRepository(MemberRoleEntity)
    private readonly roleRepository: Repository<MemberRoleEntity>,
    dataSource: DataSource,
  ) {
    super(roleRepository, dataSource);
  }

  async save(role: MemberRole): Promise<MemberRole> {
    const entity = MemberRoleMapper.toPersistence(role);
    const savedEntity = await this.roleRepository.save(entity);
    return MemberRoleMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<MemberRole | null> {
    const entity = await this.roleRepository.findOne({
      where: { roleId: id },
    });
    return entity ? MemberRoleMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<MemberRole[]> {
    const entities = await this.roleRepository.find();
    return MemberRoleMapper.toDomainArray(entities);
  }

  async findByMember(memberId: number): Promise<MemberRole[]> {
    const entities = await this.roleRepository.find({
      where: { memberId },
    });
    return MemberRoleMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.roleRepository.count({
      where: { roleId: id },
    });
    return count > 0;
  }
}
