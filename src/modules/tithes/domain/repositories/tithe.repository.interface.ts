import { Tithe } from '../tithe.aggregate';

export interface ITitheRepository {
  save(tithe: Tithe): Promise<Tithe>;
  findById(id: number): Promise<Tithe | null>;
  findAll(): Promise<Tithe[]>;
  findByMember(memberId: number): Promise<Tithe[]>;
  findByYear(year: number): Promise<Tithe[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const TITHE_REPOSITORY = Symbol('TITHE_REPOSITORY');
