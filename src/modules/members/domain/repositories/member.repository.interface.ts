import { Member } from '../member.aggregate';
import { MemberStatus } from '../../../../core/common/constants';

/**
 * Repository interface defined in the Domain layer
 * Infrastructure layer will implement this (Dependency Inversion Principle)
 */
export interface IMemberRepository {
  save(member: Member): Promise<Member>;
  findById(id: number): Promise<Member | null>;
  findAll(): Promise<Member[]>;
  findByStatus(status: MemberStatus): Promise<Member[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

// Token for dependency injection
export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');
