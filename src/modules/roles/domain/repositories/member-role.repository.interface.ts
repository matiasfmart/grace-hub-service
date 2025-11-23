import { MemberRole } from '../member-role.aggregate';

export interface IMemberRoleRepository {
  save(role: MemberRole): Promise<MemberRole>;
  findById(id: number): Promise<MemberRole | null>;
  findAll(): Promise<MemberRole[]>;
  findByMember(memberId: number): Promise<MemberRole[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const MEMBER_ROLE_REPOSITORY = Symbol('MEMBER_ROLE_REPOSITORY');
