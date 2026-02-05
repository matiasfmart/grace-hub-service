import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GdiMembershipEntity } from './gdi-membership.typeorm.entity';
import { IGdiMembershipRepository } from '../../../domain/repositories/gdi-membership.repository.interface';
import { GdiMembership } from '../../../domain/gdi-membership.aggregate';
import { GdiMembershipMapper } from './mappers/gdi-membership.mapper';

/**
 * TypeORM Implementation of IGdiMembershipRepository
 *
 * This class belongs to the Infrastructure layer
 */
@Injectable()
export class GdiMembershipRepositoryImpl implements IGdiMembershipRepository {
  constructor(
    @InjectRepository(GdiMembershipEntity)
    private readonly repository: Repository<GdiMembershipEntity>,
  ) {}

  async save(membership: GdiMembership): Promise<GdiMembership> {
    const entity = GdiMembershipMapper.toPersistence(membership);
    const savedEntity = await this.repository.save(entity);
    return GdiMembershipMapper.toDomain(savedEntity);
  }

  async findByGdiId(gdiId: number): Promise<GdiMembership[]> {
    const entities = await this.repository.find({
      where: { gdiId },
    });
    return GdiMembershipMapper.toDomainArray(entities);
  }

  async findByMemberId(memberId: number): Promise<GdiMembership | null> {
    const entity = await this.repository.findOne({
      where: { memberId },
    });
    return entity ? GdiMembershipMapper.toDomain(entity) : null;
  }

  async getMemberIdsByGdiId(gdiId: number): Promise<number[]> {
    const entities = await this.repository.find({
      where: { gdiId },
      select: ['memberId'],
    });
    return entities.map((e) => e.memberId);
  }

  async deleteByGdiIdAndMemberId(gdiId: number, memberId: number): Promise<void> {
    await this.repository.delete({ gdiId, memberId });
  }

  async deleteByMemberId(memberId: number): Promise<void> {
    await this.repository.delete({ memberId });
  }

  async memberHasGdi(memberId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { memberId },
    });
    return count > 0;
  }
}
