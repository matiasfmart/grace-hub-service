import { Tithe } from './tithe.entity';

export interface ITitheRepository {
  findAll(): Promise<Tithe[]>;
  findById(id: number): Promise<Tithe | null>;
  findByMember(memberId: number): Promise<Tithe[]>;
  findByYearAndMonth(year: number, month: number): Promise<Tithe[]>;
  upsert(memberId: number, year: number, month: number): Promise<Tithe>;
  batchUpsert(tithes: Array<{ memberId: number; year: number; month: number }>): Promise<Tithe[]>;
  delete(id: number): Promise<void>;
}
