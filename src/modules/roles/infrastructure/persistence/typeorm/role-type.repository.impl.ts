import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRoleTypeRepository } from '../../../domain/repositories/role-type.repository.interface';
import { RoleType } from '../../../domain/role-type.aggregate';
import { RoleTypeEntity } from './role-type.typeorm.entity';
import { RoleTypeMapper } from './mappers/role-type.mapper';

/**
 * TypeORM Implementation: Role Type Repository
 * 
 * Implements the repository interface defined in the domain layer.
 */
@Injectable()
export class RoleTypeRepositoryImpl implements IRoleTypeRepository {
  constructor(
    @InjectRepository(RoleTypeEntity)
    private readonly repository: Repository<RoleTypeEntity>,
  ) {}

  async findAll(): Promise<RoleType[]> {
    const entities = await this.repository.find({
      order: { name: 'ASC' },
    });
    return RoleTypeMapper.toDomainArray(entities);
  }

  async findById(id: number): Promise<RoleType | null> {
    const entity = await this.repository.findOne({
      where: { roleTypeId: id },
    });
    return entity ? RoleTypeMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<RoleType | null> {
    const entity = await this.repository
      .createQueryBuilder('rt')
      .where('LOWER(rt.name) = LOWER(:name)', { name })
      .getOne();
    return entity ? RoleTypeMapper.toDomain(entity) : null;
  }

  async save(roleType: RoleType): Promise<RoleType> {
    const entity = RoleTypeMapper.toPersistence(roleType);
    const savedEntity = await this.repository.save(entity);
    return RoleTypeMapper.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ roleTypeId: id });
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('rt')
      .where('LOWER(rt.name) = LOWER(:name)', { name })
      .getCount();
    return count > 0;
  }
}
