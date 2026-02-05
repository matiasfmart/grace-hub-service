import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaMembershipEntity } from './area-membership.typeorm.entity';
import { IAreaMembershipRepository } from '../../../domain/repositories/area-membership.repository.interface';
import { AreaMembership } from '../../../domain/area-membership.aggregate';
import { AreaMembershipMapper } from './mappers/area-membership.mapper';

/**
 * TypeORM Implementation of IAreaMembershipRepository
 *
 * This class belongs to the Infrastructure layer
 */
@Injectable()
export class AreaMembershipRepositoryImpl implements IAreaMembershipRepository {
  constructor(
    @InjectRepository(AreaMembershipEntity)
    private readonly repository: Repository<AreaMembershipEntity>,
  ) {}

  async save(membership: AreaMembership): Promise<AreaMembership> {
    const entity = AreaMembershipMapper.toPersistence(membership);
    const savedEntity = await this.repository.save(entity);
    return AreaMembershipMapper.toDomain(savedEntity);
  }

  async findByAreaId(areaId: number): Promise<AreaMembership[]> {
    const entities = await this.repository.find({
      where: { areaId },
    });
    return AreaMembershipMapper.toDomainArray(entities);
  }

  async findByMemberId(memberId: number): Promise<AreaMembership[]> {
    const entities = await this.repository.find({
      where: { memberId },
    });
    return AreaMembershipMapper.toDomainArray(entities);
  }

  async getMemberIdsByAreaId(areaId: number): Promise<number[]> {
    const entities = await this.repository.find({
      where: { areaId },
      select: ['memberId'],
    });
    return entities.map((e) => e.memberId);
  }

  async deleteByAreaIdAndMemberId(areaId: number, memberId: number): Promise<void> {
    await this.repository.delete({ areaId, memberId });
  }

  async deleteByMemberId(memberId: number): Promise<void> {
    await this.repository.delete({ memberId });
  }

  async exists(areaId: number, memberId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { areaId, memberId },
    });
    return count > 0;
  }
}
