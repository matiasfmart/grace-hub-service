import { Member } from './member.entity';

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: number): Promise<Member | null>;
  create(member: Partial<Member>): Promise<Member>;
  update(id: number, member: Partial<Member>): Promise<Member>;
  delete(id: number): Promise<void>;
  findByStatus(status: string): Promise<Member[]>;
}
