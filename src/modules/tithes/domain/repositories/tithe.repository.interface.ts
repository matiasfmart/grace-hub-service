import { Tithe } from '../tithe.aggregate';

export interface ITitheRepository {
  save(tithe: Tithe): Promise<Tithe>;
  saveMany(tithes: Tithe[]): Promise<Tithe[]>;
  findById(id: number): Promise<Tithe | null>;
  findAll(): Promise<Tithe[]>;
  findByMember(memberId: number): Promise<Tithe[]>;
  findByYear(year: number): Promise<Tithe[]>;
  findByYearAndMonth(year: number, month: number): Promise<Tithe[]>;
  findByMemberYearMonth(memberId: number, year: number, month: number): Promise<Tithe | null>;
  delete(id: number): Promise<void>;
  deleteByMemberYearMonth(memberId: number, year: number, month: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const TITHE_REPOSITORY = Symbol('TITHE_REPOSITORY');
