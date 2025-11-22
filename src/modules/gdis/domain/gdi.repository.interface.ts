import { Gdi } from './gdi.entity';

export interface IGdiRepository {
  findAll(): Promise<Gdi[]>;
  findById(id: number): Promise<Gdi | null>;
  create(gdi: Partial<Gdi>): Promise<Gdi>;
  update(id: number, gdi: Partial<Gdi>): Promise<Gdi>;
  delete(id: number): Promise<void>;
}
